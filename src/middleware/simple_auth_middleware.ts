import type { HttpContext } from '@adonisjs/core/http';
import type { NextFn } from '@adonisjs/core/types/http';
import type { ResolvedSimpleAuthConfig } from '../types.js';
import { SimpleAuth } from '../simple_auth.js';

export default class SimpleAuthMiddleware {
  public constructor(protected config: ResolvedSimpleAuthConfig) {}

  public async handle(ctx: HttpContext, next: NextFn): Promise<unknown> {
    ctx.simpleAuth = new SimpleAuth(ctx, this.config);

    return next();
  }
}
