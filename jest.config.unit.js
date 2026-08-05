import base from './jest.config.js';

/**
 * The tests that run without credentials or network — the set CI enforces.
 *
 * Most specs in this repo drive a real API with real credentials, so they cannot run on every
 * commit. Those are listed below and skipped here; everything else runs. New specs therefore run in
 * CI by default, and a new integration spec fails the build until it is added to this list — which
 * is the direction that fails safe.
 *
 * Run the full suite, including the integration specs, with `npm test` and the environment set.
 */
const integrationOnly = [
    '<rootDir>/e2e/',
    '<rootDir>/src/data.spec.ts',
    '<rootDir>/src/Flow/Service/FlowRunEndpoint.spec.ts',
    '<rootDir>/src/Flow/Service/FlowRunStatsEndpoint.spec.ts',
    '<rootDir>/src/Logging/Service/LogEndpoint.spec.ts',
    '<rootDir>/src/Service/AdapterEndpoint.spec.ts',
    '<rootDir>/src/Service/CodeDeployEndpoint.spec.ts',
    '<rootDir>/src/Service/ProjectEndpoint.spec.ts',
    '<rootDir>/src/Service/ProjectEnvironmentEndpoint.spec.ts',
    '<rootDir>/src/Service/SourcesAccountEndpoint.spec.ts',
    '<rootDir>/src/Service/StorageEndpoint.spec.ts',
    '<rootDir>/src/Service/TriggerEndpoint.spec.ts',
    '<rootDir>/src/Service/UserEndPoint.spec.ts',
    '<rootDir>/src/Service/WorkspaceEndpoint.spec.ts',
    '<rootDir>/src/Service/WorkspaceMembersEndpoint.spec.ts',
];

/** @type {import('ts-jest').JestConfigWithTsJest} */
const config = {
    ...base,
    roots: ['<rootDir>/src'],
    testPathIgnorePatterns: [...(base.testPathIgnorePatterns ?? []), ...integrationOnly],
};

export default config;
