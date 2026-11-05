import { TextEncoder } from 'node:util';
import { test } from '@japa/runner';
import { CRC32 } from '../src/helpers/crc32.js';

test.group('CRC32', () => {
  test('calculates CRC32 checksum for known strings', ({ assert }) => {
    const crc32 = new CRC32();

    assert.equal(crc32.calculate(''), 0);
    assert.equal(crc32.calculate('123456789'), 0xCBF43926);
    assert.equal(crc32.forString('hello world'), 0x0D4A1185);
  });

  test('calculates CRC32 checksum for bytes directly', ({ assert }) => {
    const crc32 = new CRC32();
    const bytes = new TextEncoder().encode('123456789');

    assert.equal(crc32.forBytes(bytes), 0xCBF43926);
  });

  test('supports custom accumulator in forBytes', ({ assert }) => {
    const crc32 = new CRC32();
    const bytes = new TextEncoder().encode('test');

    const resultWithDefault = crc32.forBytes(bytes);
    const resultWithExplicit = crc32.forBytes(bytes, 0xFFFFFFFF);

    assert.equal(resultWithDefault, resultWithExplicit);
  });
});
