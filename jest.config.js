/** @type {import('ts-jest').JestConfigWithTsJest} */
const config = {
    // preset: 'ts-jest/presets/default-esm',
    // extensionsToTreatAsEsm: ['.ts'],
    "roots": [
        "<rootDir>/src",
        "<rootDir>/e2e"
    ],
    preset: 'ts-jest/presets/js-with-ts-esm',
    extensionsToTreatAsEsm: ['.ts'],
    moduleNameMapper: {
        // '#ansi-styles': 'ansi-styles/index.js',
        // '#supports-color': 'supports-color/index.js',
        // "#(.*)": "<rootDir>/node_modules/$1",
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },
    // 'globals': {
    //     'ts-jest': {
    //         useESM: true,
    //     }
    // },
    // transform: {"\\.ts$": ['ts-jest']},
    // "testRegex": "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
    // "moduleFileExtensions": [
    //     "ts",
    //     "tsx",
    //     "js",
    //     "jsx",
    //     "json",
    //     "node"
    // ],
    setupFiles: [
        'dotenv/config'
    ],
    "testTimeout": 10000,
};
export default config;
