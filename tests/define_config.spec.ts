import { Secret } from '@adonisjs/core/helpers';
import { test } from '@japa/runner';
import { defineConfig } from '../src/define_config.js';
import { setupApp } from '../tests_helpers/helpers.js';

test.group('defineConfig', () => {
  test('resolves configuration with default apiKeyHeader', async ({ assert }) => {
    const { app } = await setupApp();

    const configProvider = defineConfig({
      apiKeyValue: 'secret-token-123',
    });

    const resolved = await configProvider.resolver(app);

    assert.equal(resolved.apiKeyHeader, 'x-api-key');
    assert.instanceOf(resolved.apiKeyValue, Secret);
    assert.equal(resolved.apiKeyValue.release(), 'secret-token-123');
  });

  test('resolves configuration with custom apiKeyHeader', async ({ assert }) => {
    const { app } = await setupApp();

    const configProvider = defineConfig({
      apiKeyHeader: 'x-custom-auth',
      apiKeyValue: 'custom-secret',
    });

    const resolved = await configProvider.resolver(app);

    assert.equal(resolved.apiKeyHeader, 'x-custom-auth');
    assert.instanceOf(resolved.apiKeyValue, Secret);
    assert.equal(resolved.apiKeyValue.release(), 'custom-secret');
  });

  test('preserves Secret instance when apiKeyValue is already a Secret', async ({ assert }) => {
    const { app } = await setupApp();
    const secret = new Secret('pre-wrapped-secret');

    const configProvider = defineConfig({
      apiKeyValue: secret,
    });

    const resolved = await configProvider.resolver(app);

    assert.strictEqual(resolved.apiKeyValue, secret);
    assert.equal(resolved.apiKeyValue.release(), 'pre-wrapped-secret');
  });
});
