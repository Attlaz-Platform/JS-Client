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
    ...attlaz.rules.typescript.default
];
// export default tseslint.config(
//     attlaz.rules.typescript.default,
// );
