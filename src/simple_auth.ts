import { type HttpContext } from '@adonisjs/core/http';
import { SimpleAuthException } from './errors.js';
import { type ResolvedSimpleAuthConfig } from './types.js';

export class SimpleAuth {
  public constructor(
    protected ctx: HttpContext,
    protected config: ResolvedSimpleAuthConfig,
  ) {}

  protected authenticationFailed(): SimpleAuthException {
    return new SimpleAuthException('Unauthorized access');
  }

  protected getApiKeyRequest(): string {
    const apiKey = this.ctx.request.header(this.config.apiKeyHeader, '')!;
    if (!apiKey.trim()) {
      throw this.authenticationFailed();
    }

    return apiKey;
  }

  public authenticate(): void {
    const apiKeyTokenRequest = this.getApiKeyRequest();
    const apiKeyTokenConfig = this.config.apiKeyValue;

    if (apiKeyTokenRequest !== apiKeyTokenConfig.release()) {
      throw this.authenticationFailed();
    }
  }
}
