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
        minRunners: {value: 0, source: null},
        maxRunners: {value: 0, source: null},
        cpuLimit: {value: null, source: null},
        memoryLimit: {value: null, source: null},
        imageId: {value: null, source: null},
    };

    public state: State = State.Active;

    public static parse(raw: any): RunnerPool {
        const queueSpecification: RunnerPool = new RunnerPool();
        queueSpecification.id = raw.id;
        queueSpecification.name = raw.name;
        queueSpecification.environment = raw.environment;

        queueSpecification.queueIdentifier = raw.queue_identifier;
        queueSpecification.deploymentIdentifier = raw.deployment_identifier;
        queueSpecification.type = raw.type;

        queueSpecification.configuration = {
            minRunners: raw.configuration.min_runners,
            maxRunners: raw.configuration.max_runners,
            cpuLimit: raw.configuration.cpu_limit,
            memoryLimit: raw.configuration.memory_limit,
            imageId: raw.configuration.image_id,
        };

        queueSpecification.state = State.fromString(raw.state);

        return queueSpecification;
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
    minRunners: ResolvedValue<number>;
    maxRunners: ResolvedValue<number>;
    cpuLimit: ResolvedValue<number | null>;
    memoryLimit: ResolvedValue<number | null>;
    imageId: ResolvedValue<string | null>;
}
