import { ApiClient, ApiRequest } from '@japa/api-client';
import { test } from '@japa/runner';
import { simpleAuthApiClient } from '../src/plugins/japa/api_client.js';
import { createTestHttpServer, setupApp } from '../tests_helpers/helpers.js';

test.group('Japa API Client plugin', (group) => {
  group.each.teardown(() => {
    ApiClient.clearSetupHooks();
  });

  test('throws RuntimeException when simpleauth config is missing', async ({ assert }) => {
    const { app } = await setupApp();
    const plugin = simpleAuthApiClient(app);

    await assert.rejects(
      async () => {
        await plugin({} as never);
      },
      'Invalid "config/simpleauth.ts" file. Make sure you are using the "defineConfig" method',
    );
  });

  test('registers withApiKey macro and attaches API key header when enabled', async ({ assert }) => {
    const { app } = await setupApp({
      config: {
        apiKeyHeader: 'x-custom-api-key',
        apiKeyValue: 'test-api-secret-999',
      },
    });

    const plugin = simpleAuthApiClient(app);
    await plugin({} as never);

    assert.isFunction(ApiRequest.prototype.withApiKey);

    const { url, getLastHeaders } = await createTestHttpServer();
    const client = new ApiClient(url);

    const responseWithKey = await client.get('/protected').withApiKey();
    assert.equal(responseWithKey.status(), 200);
    assert.equal(getLastHeaders()['x-custom-api-key'], 'test-api-secret-999');

    const responseWithoutKey = await client.get('/public');
    assert.equal(responseWithoutKey.status(), 200);
    assert.isUndefined(getLastHeaders()['x-custom-api-key']);
  });
});
