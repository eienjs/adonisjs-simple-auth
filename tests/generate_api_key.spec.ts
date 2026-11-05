import process from 'node:process';
import { base64 } from '@adonisjs/core/helpers';
import { test } from '@japa/runner';
import GenerateApiKey from '../commands/generate_api_key.js';
import { CRC32 } from '../src/helpers/crc32.js';
import { setupApp } from '../tests_helpers/helpers.js';

test.group('GenerateApiKey command', () => {
  test('displays generated API key in terminal when --show flag is passed', async ({ assert, fs }) => {
    const { ace } = await setupApp({ env: 'console', baseUrl: fs.baseUrl });

    const command = await ace.create(GenerateApiKey, ['--show']);
    await command.exec();

    command.assertSucceeded();

    const logs = ace.ui.logger.getLogs();
    const apiKeyLog = logs.find((log) => log.message.startsWith('API_KEY = oat_'));
    assert.isDefined(apiKeyLog);

    const token = apiKeyLog!.message.replace('API_KEY = ', '').trim();
    assert.match(token, /^oat_[\w-]+\.[\w-]+$/);

    const [, payloadEncoded] = token.split('.', 2);
    const decodedPayload = base64.urlDecode(payloadEncoded);
    assert.isNotNull(decodedPayload);

    const seed = decodedPayload!.slice(0, 40);
    const checksum = decodedPayload!.slice(40);
    assert.equal(checksum, String(new CRC32().calculate(seed)));
    assert.isFalse(await fs.exists('.env'));
  });

  test('writes API_KEY to .env file in non-production environment by default', async ({ assert, fs }) => {
    await fs.create('.env', '');
    const { ace } = await setupApp({ env: 'console', baseUrl: fs.baseUrl });

    const command = await ace.create(GenerateApiKey, []);
    await command.exec();

    command.assertSucceeded();

    const envContents = await fs.contents('.env');
    assert.match(envContents, /^API_KEY=oat_[\w-]+\.[\w-]+/m);
  });

  test('does not write to .env in production environment without --force', async ({ assert, fs, cleanup }) => {
    await fs.create('.env', '');
    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    cleanup(() => {
      process.env.NODE_ENV = originalNodeEnv;
    });

    const { ace } = await setupApp({ env: 'console', baseUrl: fs.baseUrl });

    const command = await ace.create(GenerateApiKey, []);
    await command.exec();

    command.assertSucceeded();

    const envContents = await fs.contents('.env');
    assert.equal(envContents.trim(), '');

    const logs = ace.ui.logger.getLogs();
    assert.isTrue(logs.some((log) => log.message.startsWith('API_KEY = oat_')));
  });

  test('writes to .env in production environment when --force flag is used', async ({ assert, fs, cleanup }) => {
    await fs.create('.env', '');
    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    cleanup(() => {
      process.env.NODE_ENV = originalNodeEnv;
    });

    const { ace } = await setupApp({ env: 'console', baseUrl: fs.baseUrl });

    const command = await ace.create(GenerateApiKey, ['--force']);
    await command.exec();

    command.assertSucceeded();

    const envContents = await fs.contents('.env');
    assert.match(envContents, /^API_KEY=oat_[\w-]+\.[\w-]+/m);
  });
});
