import { defineConfig } from 'tsdown';
import { StaleGuardRecorder } from 'tsdown-stale-guard';

export default defineConfig({
  entry: [
    'index.ts',
    'src/types.ts',
    'src/middleware/simple_auth_middleware.ts',
    'providers/simple_auth_provider.ts',
    'src/plugins/japa/api_client.ts',
    'commands/generate_api_key.ts',
  ],
  outDir: 'build',
  clean: true,
  format: ['esm'],
  minify: 'dce-only',
  fixedExtension: false,
  dts: true,
  treeshake: false,
  sourcemap: false,
  target: 'esnext',
  exports: {
    customExports(pkg, _context) {
      pkg['./commands'] = './build/commands/main.js';

      return pkg;
    },
  },
  unbundle: true,
  copy: [
    { from: 'stubs/**/*.stub', to: 'build/stubs', flatten: false },
  ],
  plugins: [
    StaleGuardRecorder(),
  ],
});
