import process from 'node:process';
import { BaseCommand, flags } from '@adonisjs/core/ace';
import { EnvEditor } from '@adonisjs/core/env/editor';
import { base64, Secret } from '@adonisjs/core/helpers';
import string from '@adonisjs/core/helpers/string';
import { CRC32 } from '../src/helpers/crc32.js';

export default class GenerateApiKey extends BaseCommand {
  public static readonly commandName = 'generate:api-key';

  public static readonly description =
    'Generate a a cryptographically secure random value suffixed with a CRC32 checksum';

  @flags.boolean({
    description: 'Display the token on the terminal, instead of writing it to .env file',
  })
  declare public show: boolean;

  @flags.boolean({
    description: 'Force update .env file in production environment',
  })
  declare public force: boolean;

  public async run() {
    let writeToFile = process.env.NODE_ENV !== 'production';
    if (this.force) {
      writeToFile = true;
    }

    if (this.show) {
      writeToFile = false;
    }

    const seed = string.random(40);
    const tokenSecret = new Secret(`${seed}${new CRC32().calculate(seed)}`);
    const result = new Secret(
      `oat_${base64.urlEncode(String(string.random(2)))}.${base64.urlEncode(tokenSecret.release())}`,
    );
    const tokenString = result.release();

    if (writeToFile) {
      const editor = await EnvEditor.create(this.app.appRoot);
      editor.add('API_KEY', tokenString, true);
      await editor.save();
      this.logger.action('add API_KEY to .env').succeeded();
    } else {
      this.logger.log(`API_KEY = ${tokenString}`);
    }
  }
}
