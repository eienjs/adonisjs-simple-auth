import { Exception } from '@adonisjs/core/exceptions';

export class SimpleAuthException extends Exception {
  public static readonly code: 'E_SIMPLE_UNAUTHORIZED_ACCESS';

  public static readonly status: 401;
}
