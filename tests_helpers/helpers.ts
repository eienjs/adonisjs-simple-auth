import type { Kernel } from '@adonisjs/core/ace';
import type { HttpContext } from '@adonisjs/core/http';
import type { ApplicationService } from '@adonisjs/core/types';
import type { AppEnvironments } from '@adonisjs/core/types/app';
import type { IncomingMessage, ServerResponse } from 'node:http';
import type { ResolvedSimpleAuthConfig, SimpleAuthConfig } from '../src/types.js';
import { createServer } from 'node:http';
import { IgnitorFactory } from '@adonisjs/core/factories';
import { HttpContextFactory } from '@adonisjs/core/factories/http';
import { Secret } from '@adonisjs/core/helpers';
import { getActiveTest } from '@japa/runner';
import { defineConfig } from '../src/define_config.js';

export const BASE_URL = new URL('tmp/', import.meta.url);

export interface SetupAppOptions {
  env?: AppEnvironments;
  baseUrl?: URL;
  config?: SimpleAuthConfig;
  withProvider?: boolean;
}

export const setupApp = async (
  options: SetupAppOptions = {},
): Promise<{
  app: ApplicationService;
  ace: Kernel;
}> => {
  const baseUrl = options.baseUrl ?? BASE_URL;
  const ignitor = new IgnitorFactory()
    .merge({
      rcFileContents: {
        providers: options.withProvider
          ? [async () => import('../providers/simple_auth_provider.js')]
          : [],
      },
      config: options.config
        ? { simpleauth: defineConfig(options.config) }
        : {},
    })
    .withCoreProviders()
    .withCoreConfig()
    .create(baseUrl, {
      importer: async (filePath) => {
        if (filePath.startsWith('./') || filePath.startsWith('../')) {
          return (await import(new URL(filePath, baseUrl).href)) as Record<string, unknown>;
        }

        return (await import(filePath)) as Record<string, unknown>;
      },
    });

  const app = ignitor.createApp(options.env ?? 'web');
  await app.init();
  await app.boot();

  const ace = await app.container.make('ace');
  ace.ui.switchMode('raw');

  const activeTest = getActiveTest();
  if (activeTest) {
    activeTest.cleanup(async () => {
      await app.terminate();
    });
  }

  return { app, ace };
};

export const createHttpContext = (headers: Record<string, string> = {}): HttpContext => {
  const ctx = new HttpContextFactory().create();

  for (const [key, value] of Object.entries(headers)) {
    ctx.request.request.headers[key.toLowerCase()] = value;
  }

  return ctx;
};

export const createResolvedConfig = (
  apiKeyValue = 'valid-secret-key',
  apiKeyHeader = 'x-api-key',
): ResolvedSimpleAuthConfig => {
  return {
    apiKeyHeader,
    apiKeyValue: new Secret(apiKeyValue),
  };
};

export const createTestHttpServer = async (): Promise<{
  url: string;
  getLastHeaders: () => IncomingMessage['headers'];
}> => {
  let lastHeaders: IncomingMessage['headers'] = {};
  const server = createServer((req: IncomingMessage, res: ServerResponse) => {
    lastHeaders = req.headers;
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ ok: true }));
  });

  await new Promise<void>((resolve) => {
    server.listen(0, '127.0.0.1', () => {
      resolve();
    });
  });

  const activeTest = getActiveTest();
  if (activeTest) {
    activeTest.cleanup(async () => {
      await new Promise<void>((resolve) => {
        server.close(() => {
          resolve();
        });
      });
    });
  }

  const address = server.address();
  const port = typeof address === 'object' && address ? address.port : 0;

  return {
    url: `http://127.0.0.1:${port}`,
    getLastHeaders: () => lastHeaders,
  };
};
