import { Exception } from '@adonisjs/core/exceptions';
import { type HttpContext } from '@adonisjs/core/http';
import { type I18n } from '@adonisjs/i18n';

export class SimpleAuthException extends Exception {
  public static readonly code = 'E_SIMPLE_UNAUTHORIZED_ACCESS';

  public static readonly status = 401;

  /**
   * Translation identifier. Can be customized
   */
  public identifier = `errors.${SimpleAuthException.code}`;

  /**
   * Returns the message to be sent in the HTTP response.
   * Feel free to override this method and return a custom
   * response.
   */
  public getResponseMessage(error: this, ctx: HttpContext): string {
    if ('i18n' in ctx) {
      return (ctx.i18n as I18n).t(error.identifier, {}, error.message);
    }

    return error.message;
  }

  public async handle(error: this, ctx: HttpContext): Promise<void> {
    const message = this.getResponseMessage(error, ctx);

    switch (ctx.request.accepts(['html', 'application/vnd.api+json', 'json'])) {
      case 'html':
      case null:
      case 'json': {
        ctx.response.status(error.status).send({
          errors: [
            {
              message,
            },
          ],
        });
        break;
      }
      case 'application/vnd.api+json': {
        ctx.response.status(error.status).send({
          errors: [
            {
              code: error.code,
              title: message,
            },
          ],
        });
        break;
      }
    }
  }
}
