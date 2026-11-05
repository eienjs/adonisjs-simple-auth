import type { HttpContext } from '@adonisjs/core/http';
import { test } from '@japa/runner';
import { SimpleAuthException } from '../src/errors.js';
import { createHttpContext } from '../tests_helpers/helpers.js';

test.group('SimpleAuthException', () => {
  test('has expected static code, status, and identifier', ({ assert }) => {
    const error = new SimpleAuthException('Unauthorized access');

    assert.equal(SimpleAuthException.code, 'E_SIMPLE_UNAUTHORIZED_ACCESS');
    assert.equal(SimpleAuthException.status, 401);
    assert.equal(error.code, 'E_SIMPLE_UNAUTHORIZED_ACCESS');
    assert.equal(error.status, 401);
    assert.equal(error.identifier, 'errors.E_SIMPLE_UNAUTHORIZED_ACCESS');
    assert.equal(error.message, 'Unauthorized access');
  });

  test('returns default error message when i18n is not in HttpContext', ({ assert }) => {
    const ctx = createHttpContext();
    const error = new SimpleAuthException('Unauthorized access');

    assert.equal(error.getResponseMessage(error, ctx), 'Unauthorized access');
  });

  test('returns translated message when i18n is available in HttpContext', ({ assert }) => {
    const ctx = createHttpContext() as unknown as Record<string, unknown>;
    ctx.i18n = {
      t(identifier: string, _data: Record<string, unknown>, fallbackMessage: string) {
        if (identifier === 'errors.E_SIMPLE_UNAUTHORIZED_ACCESS') {
          return 'Acceso no autorizado';
        }

        return fallbackMessage;
      },
    };

    const error = new SimpleAuthException('Unauthorized access');

    assert.equal(
      error.getResponseMessage(error, ctx as unknown as HttpContext),
      'Acceso no autorizado',
    );
  });

  test('handles JSON response when Accept header is application/json', async ({ assert }) => {
    const ctx = createHttpContext({ accept: 'application/json' });
    const error = new SimpleAuthException('Unauthorized access');

    await error.handle(error, ctx);

    assert.equal(ctx.response.getStatus(), 401);
    assert.deepEqual(ctx.response.getBody(), {
      errors: [{ message: 'Unauthorized access' }],
    });
  });

  test('handles HTML / default response as errors array with message', async ({ assert }) => {
    const ctx = createHttpContext({ accept: 'text/html' });
    const error = new SimpleAuthException('Unauthorized access');

    await error.handle(error, ctx);

    assert.equal(ctx.response.getStatus(), 401);
    assert.deepEqual(ctx.response.getBody(), {
      errors: [{ message: 'Unauthorized access' }],
    });
  });

  test('handles fallback response when Accept header does not match known types', async ({ assert }) => {
    const ctx = createHttpContext({ accept: 'text/plain' });
    const error = new SimpleAuthException('Unauthorized access');

    await error.handle(error, ctx);

    assert.equal(ctx.response.getStatus(), 401);
    assert.deepEqual(ctx.response.getBody(), {
      errors: [{ message: 'Unauthorized access' }],
    });
  });

  test('handles JSON:API response when Accept header is application/vnd.api+json', async ({ assert }) => {
    const ctx = createHttpContext({ accept: 'application/vnd.api+json' });
    const error = new SimpleAuthException('Unauthorized access');

    await error.handle(error, ctx);

    assert.equal(ctx.response.getStatus(), 401);
    assert.deepEqual(ctx.response.getBody(), {
      errors: [
        {
          code: 'E_SIMPLE_UNAUTHORIZED_ACCESS',
          title: 'Unauthorized access',
        },
      ],
    });
  });
});
