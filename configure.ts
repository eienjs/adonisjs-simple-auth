import type Configure from '@adonisjs/core/commands/configure';
import { stubsRoot } from './stubs/main.js';

export const configure = async (command: Configure): Promise<void> => {
  const codemods = await command.createCodemods();

  // Publish commands and provider
  await codemods.updateRcFile((rcFile) => {
    rcFile.addCommand('@eienjs/adonisjs-simple-auth/commands');
    rcFile.addProvider('@eienjs/adonisjs-simple-auth/simple_auth_provider');
  });

  // Publish config file
  await codemods.makeUsingStub(stubsRoot, 'config.stub', {});

  // Publish api key middleware
  await codemods.makeUsingStub(stubsRoot, 'middleware/api_key.stub', {
    entity: command.app.generators.createEntity('api_key'),
  });

  // Register middleware
  await codemods.registerMiddleware('router', [{ path: '@eienjs/adonisjs-simple-auth/simple_auth_middleware' }]);
  await codemods.registerMiddleware('named', [
    {
      name: 'apiKey',
      path: '#middleware/api_key_middleware',
    },
  ]);
};
