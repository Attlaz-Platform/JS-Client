import path from "node:path";
import {fileURLToPath} from "node:url";
import * as attlaz from "eslint-config-attlaz-base";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// const compat = new FlatCompat({
//     baseDirectory: __dirname,
//     recommendedConfig: js.configs.recommended,
//     allConfig: js.configs.all
// });
export default [
    ...attlaz.rules.typescript.default,
    {
        // This package runs in the browser as well as in Node, so a Node global is a runtime
        // error for half the consumers — and an invisible one: `types: ["node"]` in tsconfig
        // means tsc type-checks `Buffer` happily, so nothing failed until a browser executed it.
        // That is exactly how `Buffer.from(await response.arrayBuffer())` reached production and
        // broke every API call in the dashboard.
        //
        // Use the web equivalents, which exist in both runtimes: Uint8Array for bytes,
        // TextEncoder/TextDecoder to convert, btoa/atob for base64. Where a genuinely Node-only
        // capability is needed, guard it — `typeof process !== 'undefined'` — rather than
        // referencing the global directly.
        files: ['src/**/*.ts'],
        ignores: ['src/**/*.spec.ts', 'src/**/*.ispec.ts'],
        rules: {
            'no-restricted-globals': ['error',
                {name: 'Buffer', message: 'Buffer is Node-only; this package also runs in the browser. Use Uint8Array, with TextEncoder/TextDecoder to convert.'},
                {name: 'process', message: 'process is Node-only; this package also runs in the browser. Guard with a typeof check if you genuinely need it.'},
                {name: '__dirname', message: '__dirname is Node-only; this package also runs in the browser.'},
                {name: '__filename', message: '__filename is Node-only; this package also runs in the browser.'},
            ],
        },
    },
];
// export default tseslint.config(
//     attlaz.rules.typescript.default,
// );
