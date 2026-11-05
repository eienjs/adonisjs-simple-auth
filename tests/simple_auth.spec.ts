import { test } from '@japa/runner';
import { SimpleAuthException } from '../src/errors.js';
import { SimpleAuth } from '../src/simple_auth.js';
import { createHttpContext, createResolvedConfig } from '../tests_helpers/helpers.js';

test.group('SimpleAuth', () => {
  test('authenticates successfully when API key header matches configured value', ({ assert }) => {
    const ctx = createHttpContext({ 'x-api-key': 'valid-secret-key' });
    const simpleAuth = new SimpleAuth(ctx, createResolvedConfig('valid-secret-key'));

    assert.doesNotThrow(() => {
      simpleAuth.authenticate();
    });
  });

  test('authenticates successfully with a custom header name', ({ assert }) => {
    const ctx = createHttpContext({ 'x-custom-token': 'custom-secret-key' });
    const simpleAuth = new SimpleAuth(ctx, createResolvedConfig('custom-secret-key', 'x-custom-token'));

    assert.doesNotThrow(() => {
      simpleAuth.authenticate();
    });
  });

  test('throws SimpleAuthException when API key header is missing', ({ assert }) => {
    const ctx = createHttpContext();
    const simpleAuth = new SimpleAuth(ctx, createResolvedConfig('valid-secret-key'));

    assert.throws(
      () => {
        simpleAuth.authenticate();
      },
      SimpleAuthException,
      'Unauthorized access',
    );
  });

  test('throws SimpleAuthException when API key header is empty or whitespace', ({ assert }) => {
    const ctx = createHttpContext({ 'x-api-key': ' '.repeat(3) });
    const simpleAuth = new SimpleAuth(ctx, createResolvedConfig('valid-secret-key'));

    assert.throws(
      () => {
        simpleAuth.authenticate();
      },
      SimpleAuthException,
      'Unauthorized access',
    );
  });

  test('throws SimpleAuthException when API key header does not match configured value', ({ assert }) => {
    const ctx = createHttpContext({ 'x-api-key': 'wrong-secret-key' });
    const simpleAuth = new SimpleAuth(ctx, createResolvedConfig('valid-secret-key'));

    assert.throws(
      () => {
        simpleAuth.authenticate();
      },
      SimpleAuthException,
      'Unauthorized access',
    );
  });
});
