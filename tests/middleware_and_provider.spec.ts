import { test } from '@japa/runner';
import SimpleAuthProvider from '../providers/simple_auth_provider.js';
import { SimpleAuthException } from '../src/errors.js';
import SimpleAuthMiddleware from '../src/middleware/simple_auth_middleware.js';
import { SimpleAuth } from '../src/simple_auth.js';
import {
  createHttpContext,
  createResolvedConfig,
  setupApp,
} from '../tests_helpers/helpers.js';

test.group('SimpleAuthMiddleware & SimpleAuthProvider', () => {
  test('SimpleAuthMiddleware attaches SimpleAuth instance to HttpContext and calls next', async ({ assert }) => {
    const ctx = createHttpContext({ 'x-api-key': 'my-secret' });
    const middleware = new SimpleAuthMiddleware(createResolvedConfig('my-secret'));

    let nextCalled = false;
    const result = await middleware.handle(ctx, () => {
      nextCalled = true;

      return 'next-result';
    });

    assert.isTrue(nextCalled);
    assert.equal(result, 'next-result');
    assert.instanceOf(ctx.simpleAuth, SimpleAuth);
    assert.doesNotThrow(() => {
      ctx.simpleAuth.authenticate();
    });
  });

  test('ctx.simpleAuth throws SimpleAuthException when key is invalid after middleware runs', async ({ assert }) => {
    const ctx = createHttpContext({ 'x-api-key': 'wrong-key' });
    const middleware = new SimpleAuthMiddleware(createResolvedConfig('my-secret'));

    await middleware.handle(ctx, () => true);

    assert.throws(() => {
      ctx.simpleAuth.authenticate();
    }, SimpleAuthException);
  });

  test('SimpleAuthProvider registers SimpleAuthMiddleware singleton in container', async ({ assert }) => {
    const { app } = await setupApp({
      withProvider: true,
      config: {
        apiKeyHeader: 'x-api-key',
        apiKeyValue: 'provider-secret',
      },
    });

    const middleware = await app.container.make(SimpleAuthMiddleware);
    assert.instanceOf(middleware, SimpleAuthMiddleware);
  });

  test('SimpleAuthProvider throws RuntimeException when config is missing or invalid', async ({ assert }) => {
    const { app } = await setupApp();

    const provider = new SimpleAuthProvider(app);
    provider.register();

    await assert.rejects(
      async () => {
        await app.container.make(SimpleAuthMiddleware);
      },
      'Invalid "config/simpleauth.ts" file. Make sure you are using the "defineConfig" method',
    );
  });
});
