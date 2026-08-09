import {loadEnv} from 'vite';
import {defineConfig} from 'vitest/config';

// Specs are split by what they need to run:
//   *.spec.ts   pure unit tests, no credentials and no network
//   *.ispec.ts  integration tests driving a real API with real credentials
//
// This replaces the hand-maintained skip list in the old jest.config.unit.js. The guarantee is the
// same and self-maintaining: a new spec runs in CI unless its author names it `.ispec.ts`.
//
// The mode selects which set runs:
//   npm test                 -> `--mode unit`,        unit specs only (what CI enforces)
//   npm run test-integration -> `--mode integration`, integration specs only
//   no mode                  -> BOTH, so an IDE run button works on either kind
export default defineConfig(({mode}) => {
    const unitOnly: boolean = mode === 'unit';
    const integrationOnly: boolean = mode === 'integration';

    let include: string[];
    if (unitOnly) {
        include = ['{src,e2e}/**/*.spec.ts'];
    } else if (integrationOnly) {
        include = ['{src,e2e}/**/*.ispec.ts'];
    } else {
        include = ['{src,e2e}/**/*.spec.ts', '{src,e2e}/**/*.ispec.ts'];
    }

    return {
        resolve: {
            // Source uses ESM-style `./Foo.js` specifiers that point at `./Foo.ts`.
            alias: [
                {find: /^(\.{1,2}\/.*)\.js$/, replacement: '$1'},
            ],
        },
        test: {
            // `describe` / `test` / `expect` without importing them.
            globals: true,
            environment: 'node',
            include,
            // Integration specs read credentials from process.env. A vitest worker exposes inherited
            // variables as readable but not enumerable, so pass them through `test.env` instead of
            // relying on `node --env-file`.
            env: unitOnly ? {} : loadEnv(mode, process.cwd(), ''),
            // Driving a real API is far slower than the 5s default.
            testTimeout: unitOnly ? 5_000 : 60_000,
        },
    };
});
