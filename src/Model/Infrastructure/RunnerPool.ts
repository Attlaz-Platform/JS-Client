import {ApiRecord} from '../ApiRecord.js';
import {State} from '../State.js';

export class RunnerPool {
    public id: string;
    public name: string;

    public environment: string;

    public queueIdentifier: string;
    public deploymentIdentifier: string;

    public type: QueueSpecificationType = 'flow_run';

    // Resolved server-side via the configuration chain (pool → env → workspace → zone fallback).
    // Each field reports the resolved value plus the scope it came from. source === null means
    // the value is a baked-in default (nothing was found anywhere in the chain).
    public configuration: RunnerPoolConfiguration = {
        enabled: {value: false, source: null},
        minRunners: {value: 0, source: null},
        maxRunners: {value: 0, source: null},
        cpuLimit: {value: null, source: null},
        memoryLimit: {value: null, source: null},
        imageId: {value: null, source: null},
        runnerEndpoint: {value: null, source: null},
        codeEndpoint: {value: null, source: null},
        runnerTokenId: {value: null, source: null},
        codeTokenId: {value: null, source: null},
    };

    public state: State = State.Active;

    public static parse(raw: ApiRecord): RunnerPool {
        const queueSpecification: RunnerPool = new RunnerPool();
        queueSpecification.id = raw.id as string;
        queueSpecification.name = raw.name as string;
        queueSpecification.environment = raw.environment as string;

        queueSpecification.queueIdentifier = raw.queue_identifier as string;
        queueSpecification.deploymentIdentifier = raw.deployment_identifier as string;
        queueSpecification.type = raw.type as QueueSpecificationType;

        // Per-field defensive parsing. Each entry falls back to a default ResolvedValue
        // if the server didn't send it or sent a malformed shape — keeps the UI alive
        // when wire contracts drift (e.g. the API auto-strips `_id` so `image_id` arrives
        // as `image`; we hit that 2026-05-17). Missing/malformed fields are collected and
        // logged together as a single console.warn so server-side regressions stay visible.
        const config: any = raw.configuration ?? {};
        const missing: string[] = [];
        if (raw.configuration === undefined || raw.configuration === null) {
            missing.push('(entire configuration object)');
        }
        queueSpecification.configuration = {
            enabled: RunnerPool.parseResolved(config.enabled, false, 'enabled', missing),
            minRunners: RunnerPool.parseResolved(config.min_runners, 0, 'min_runners', missing),
            maxRunners: RunnerPool.parseResolved(config.max_runners, 0, 'max_runners', missing),
            cpuLimit: RunnerPool.parseResolved<number | null>(config.cpu_limit, null, 'cpu_limit', missing),
            memoryLimit: RunnerPool.parseResolved<number | null>(config.memory_limit, null, 'memory_limit', missing),
            // API strips `_id` suffix from snake_case keys, so `image_id` → `image` on the wire.
            imageId: RunnerPool.parseResolved<string | null>(config.image, null, 'image', missing),
            runnerEndpoint: RunnerPool.parseResolved<string | null>(config.runner_endpoint, null, 'runner_endpoint', missing),
            runnerTokenId: RunnerPool.parseResolved<string | null>(config.runner_token, null, 'runner_token', missing),
            codeEndpoint: RunnerPool.parseResolved<string | null>(config.code_endpoint, null, 'code_endpoint', missing),
            codeTokenId: RunnerPool.parseResolved<string | null>(config.code_token, null, 'code_token', missing),
        };

        if (missing.length > 0) {
            console.warn('RunnerPool.parse: pool "' + queueSpecification.id + '" has missing or malformed configuration fields', {fields: missing});
        }

        queueSpecification.state = State.fromString(raw.state as string);

        return queueSpecification;
    }

    /**
     * Coerce a raw wire value into a ResolvedValue<T> envelope. Accepts `{value, source}`
     * as-is; falls back to `{value: defaultValue, source: null}` when the input is null,
     * undefined, or missing the envelope shape, and appends the field name to `missing`
     * so the caller can log a single batched warning. The `value` itself isn't type-
     * validated — if T is `string | null` and the server sends a number, that's a
     * server-side bug, not something this layer can fix.
     */
    private static parseResolved<T>(raw: any, defaultValue: T, fieldName: string, missing: string[]): ResolvedValue<T> {
        if (raw !== null && typeof raw === 'object' && 'value' in raw && 'source' in raw) {
            return raw as ResolvedValue<T>;
        }
        missing.push(fieldName);
        return {value: defaultValue, source: null};
    }
}

export type QueueSpecificationType = 'flow_run';

// Matches the entity class-name strings emitted by the API (EntityHelper.getEntityTypeById in Library/Core).
export type ConfigurationSource = 'RunnerPool' | 'ProjectEnvironment' | 'Workspace' | 'Zone';

export interface ResolvedValue<T> {
    value: T;
    source: ConfigurationSource | null;
}

export interface RunnerPoolConfiguration {
    enabled: ResolvedValue<boolean>;
    minRunners: ResolvedValue<number>;
    maxRunners: ResolvedValue<number>;
    cpuLimit: ResolvedValue<number | null>;
    memoryLimit: ResolvedValue<number | null>;
    imageId: ResolvedValue<string | null>;
    runnerEndpoint: ResolvedValue<string | null>;
    runnerTokenId: ResolvedValue<string | null>;
    codeEndpoint: ResolvedValue<string | null>;
    codeTokenId: ResolvedValue<string | null>;
}
