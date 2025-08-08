import type { Secret } from '@adonisjs/core/helpers';

export interface SimpleAuthConfig {
  apiKeyHeader?: string;
  apiKeyValue: string;
}

export interface ResolvedSimpleAuthConfig {
  apiKeyHeader: string;
  apiKeyValue: Secret<string>;
}
