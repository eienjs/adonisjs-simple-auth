import { type HttpContext } from '@adonisjs/core/http';
import { type NextFn } from '@adonisjs/core/types/http';
import { SimpleAuth } from '../simple_auth.js';
import { type ResolvedSimpleAuthConfig } from '../types.js';

export default class SimpleAuthMiddleware {
  public constructor(protected config: ResolvedSimpleAuthConfig) {}

  public async handle(ctx: HttpContext, next: NextFn) {
    ctx.simpleAuth = new SimpleAuth(ctx, this.config);

    return next();
  }
}
