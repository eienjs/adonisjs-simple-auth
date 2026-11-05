import Configure from '@adonisjs/core/commands/configure';
import { test } from '@japa/runner';
import { setupApp } from '../tests_helpers/helpers.js';

test.group('Configure', () => {
  test('publishes config, middleware, provider, and command registrations', async ({ assert, fs }) => {
    const { ace } = await setupApp({ env: 'console', baseUrl: fs.baseUrl });

    await fs.create('.env', '');
    await fs.createJson('tsconfig.json', {});
    await fs.create('adonisrc.ts', 'import { defineConfig } from \'@adonisjs/core/app\'\n\nexport default defineConfig({})\n');
    await fs.create('start/kernel.ts', 'import router from \'@adonisjs/core/services/router\'\n\nrouter.use([])\nexport const middleware = router.named({})\n');

    const command = await ace.create(Configure, [new URL('../index.js', import.meta.url).href]);
    await command.exec();

    command.assertSucceeded();

    await assert.fileExists('config/simpleauth.ts');
    await assert.fileContains('config/simpleauth.ts', 'defineConfig');
    await assert.fileContains('config/simpleauth.ts', 'apiKeyHeader: \'x-api-key\'');

    await assert.fileExists('app/middleware/api_key_middleware.ts');
    await assert.fileContains('app/middleware/api_key_middleware.ts', 'ctx.simpleAuth.authenticate()');

    await assert.fileContains('adonisrc.ts', '@eienjs/adonisjs-simple-auth/commands');
    await assert.fileContains('adonisrc.ts', '@eienjs/adonisjs-simple-auth/providers/simple_auth_provider');

    await assert.fileContains('start/kernel.ts', '@eienjs/adonisjs-simple-auth/middleware/simple_auth_middleware');
    await assert.fileContains('start/kernel.ts', '#middleware/api_key_middleware');
  }).timeout(15_000);
});
