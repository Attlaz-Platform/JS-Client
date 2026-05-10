import {State} from '../State.js';

export class RunnerPool {
    public id: string;
    public name: string;

    public environment: string;

    public queueIdentifier: string;
    public deploymentIdentifier: string;

    public type: QueueSpecificationType = 'flow_run';

    // Effective values resolved server-side via the configuration chain (pool → env → workspace → zone fallback).
    public effectiveMinRunners: number | null = null;
    public effectiveMaxRunners: number | null = null;
    public effectiveCpuLimit: number | null = null;
    public effectiveMemoryLimit: number | null = null;
    public effectiveImageId: string | null = null;

    public state: State = State.Active;

    public static parse(raw: any): RunnerPool {
        const queueSpecification: RunnerPool = new RunnerPool();
        queueSpecification.id = raw.id;
        queueSpecification.name = raw.name;
        queueSpecification.environment = raw.environment;

        queueSpecification.queueIdentifier = raw.queue_identifier;
        queueSpecification.deploymentIdentifier = raw.deployment_identifier;
        queueSpecification.type = raw.type;

        queueSpecification.effectiveMinRunners = raw.effective_min_runners ?? null;
        queueSpecification.effectiveMaxRunners = raw.effective_max_runners ?? null;
        queueSpecification.effectiveCpuLimit = raw.effective_cpu_limit ?? null;
        queueSpecification.effectiveMemoryLimit = raw.effective_memory_limit ?? null;
        queueSpecification.effectiveImageId = raw.effective_image_id ?? null;

        queueSpecification.state = State.fromString(raw.state);

        return queueSpecification;
    }
}

export type QueueSpecificationType = 'flow_run';
