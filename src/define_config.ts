import { configProvider } from '@adonisjs/core';
import { Secret } from '@adonisjs/core/helpers';
import { type ConfigProvider } from '@adonisjs/core/types';
import { type ResolvedSimpleAuthConfig, type SimpleAuthConfig } from './types.js';

export const defineConfig = (config: SimpleAuthConfig): ConfigProvider<ResolvedSimpleAuthConfig> => {
  return configProvider.create(async (_) => {
    return {
      apiKeyHeader: config.apiKeyHeader ?? 'x-api-key',
      apiKeyValue: new Secret(config.apiKeyValue),
    };
  });
};
