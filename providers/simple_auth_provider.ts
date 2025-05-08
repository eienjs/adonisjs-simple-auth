import { configProvider } from '@adonisjs/core';
import { RuntimeException } from '@adonisjs/core/exceptions';
import { type ApplicationService } from '@adonisjs/core/types';
import SimpleAuthMiddleware from '../src/middleware/simple_auth_middleware.js';
import { type SimpleAuth } from '../src/simple_auth.js';
import { type ResolvedSimpleAuthConfig, type SimpleAuthConfig } from '../src/types.js';

/**
 * HttpContext augmentations
 */
declare module '@adonisjs/core/http' {
  export interface HttpContext {
    simpleAuth: SimpleAuth;
  }
}

export default class SimpleAuthProvider {
  public constructor(protected app: ApplicationService) {}

  public register(): void {
    this.app.container.singleton(SimpleAuthMiddleware, async () => {
      const simpleAuthConfigProvider = this.app.config.get<SimpleAuthConfig>('simpleauth');
      const config = await configProvider.resolve<ResolvedSimpleAuthConfig>(this.app, simpleAuthConfigProvider);
      if (!config) {
        throw new RuntimeException(
          'Invalid "config/simpleauth.ts" file. Make sure you are using the "defineConfig" method',
        );
      }

      return new SimpleAuthMiddleware(config);
    });
  }
}
