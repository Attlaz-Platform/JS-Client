import {State} from '../State.js';

export class RunnerPool {
    public id: string;
    public name: string;

    public environment: string;

    public queueIdentifier: string;
    public deploymentIdentifier: string;

    public type: QueueSpecificationType = 'flow_run';

    // Resolved server-side via the configuration chain (pool → env → workspace → zone fallback). null = unset anywhere in the chain.
    public configuration: RunnerPoolConfiguration = {
        minRunners: null,
        maxRunners: null,
        cpuLimit: null,
        memoryLimit: null,
        imageId: null,
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

        const rawConfiguration = raw.configuration ?? {};
        queueSpecification.configuration = {
            minRunners: rawConfiguration.min_runners ?? null,
            maxRunners: rawConfiguration.max_runners ?? null,
            cpuLimit: rawConfiguration.cpu_limit ?? null,
            memoryLimit: rawConfiguration.memory_limit ?? null,
            imageId: rawConfiguration.image_id ?? null,
        };

        queueSpecification.state = State.fromString(raw.state);

        return queueSpecification;
    }
}

export type QueueSpecificationType = 'flow_run';

export interface RunnerPoolConfiguration {
    minRunners: number | null;
    maxRunners: number | null;
    cpuLimit: number | null;
    memoryLimit: number | null;
    imageId: string | null;
}
