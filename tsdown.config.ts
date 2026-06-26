import { defineConfig } from 'tsdown';
import { StaleGuardRecorder } from 'tsdown-stale-guard';

export default defineConfig({
  entry: [
    'index.ts',
    { types: 'src/types.ts' },
    { 'middleware/*': 'src/middleware/*.ts' },
    { 'plugins/*': ['src/plugins/japa/*.ts'] },
    { 'providers/*': 'providers/*.ts' },
    { 'commands/*': 'commands/*.ts' },
  ],
  outDir: 'build',
  clean: true,
  format: ['esm'],
  minify: 'dce-only',
  fixedExtension: false,
  dts: true,
  target: 'esnext',
  exports: {
    customExports(pkg, _context) {
      pkg['./commands'] = './build/commands/main.js';

      return pkg;
    },
  },
  unbundle: true,
  deps: {
    skipNodeModulesBundle: true,
  },
  copy: [
    { from: 'stubs/**/*.stub', to: 'build/stubs', flatten: false },
  ],
  plugins: [
    StaleGuardRecorder(),
  ],
});
