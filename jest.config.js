module.exports = {
    // preset: 'ts-jest/presets/default-esm',
    // extensionsToTreatAsEsm: ['.ts'],
    "roots": [
        "<rootDir>/src",
        "<rootDir>/e2e"
    ],
    // 'globals': {
    //     'ts-jest': {
    //         useESM: true,
    //     }
    // },
    transform: {"\\.ts$": ['ts-jest']},
    "testRegex": "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
    "moduleFileExtensions": [
        "ts",
        "tsx",
        "js",
        "jsx",
        "json",
        "node"
    ],
    setupFiles: [
        'dotenv/config'
    ],
    "testTimeout": 10000,
};
