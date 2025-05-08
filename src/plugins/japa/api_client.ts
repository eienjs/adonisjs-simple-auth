import { configProvider } from '@adonisjs/core';
import { RuntimeException } from '@adonisjs/core/exceptions';
import { type ApplicationService } from '@adonisjs/core/types';
import { ApiClient, ApiRequest } from '@japa/api-client';
import { type PluginFn } from '@japa/runner/types';
import { type ResolvedSimpleAuthConfig, type SimpleAuthConfig } from '../../types.js';

const API_KEY_ENABLED = Symbol.for('API_KEY_ENABLED');

declare module '@japa/api-client' {
  export interface ApiRequest {
    [API_KEY_ENABLED]: boolean;
    withApiKey(): this;
  }
}

export const simpleAuthApiClient = (app: ApplicationService): PluginFn => {
  const pluginFn: PluginFn = async function () {
    const simpleAuthConfigProvider = app.config.get<SimpleAuthConfig>('simpleauth');
    const config = await configProvider.resolve<ResolvedSimpleAuthConfig>(app, simpleAuthConfigProvider);
    if (!config) {
      throw new RuntimeException(
        'Invalid "config/simpleauth.ts" file. Make sure you are using the "defineConfig" method',
      );
    }

    ApiRequest.macro('withApiKey', function (this: ApiRequest) {
      this[API_KEY_ENABLED] = true;

      return this;
    });

    ApiClient.setup(async (request) => {
      const isApiKeyEnabled = request[API_KEY_ENABLED];
      if (!isApiKeyEnabled) {
        return;
      }

      request.header(config.apiKeyHeader, config.apiKeyValue.release());
    });
  };

  return pluginFn;
};
