import {State} from '../State.js';

export class RunnerPool {
    public id: string;
    public name: string;

    public environment: string;

    public queueIdentifier: string;
    public deploymentIdentifier: string;

    public type: QueueSpecificationType = 'flow_run';

    public minRunners: number;
    public maxRunners: number;

    public state: State = State.Active;

    public static parse(raw: any): RunnerPool {
        const queueSpecification: RunnerPool = new RunnerPool();
        queueSpecification.id = raw.id;
        queueSpecification.name = raw.name;
        queueSpecification.environment = raw.environment;

        queueSpecification.queueIdentifier = raw.queue_identifier;
        queueSpecification.deploymentIdentifier = raw.deployment_identifier;
        queueSpecification.type = raw.type;

        queueSpecification.minRunners = raw.min_runners;
        queueSpecification.maxRunners = raw.max_runners;

        queueSpecification.state = State.fromString(raw.state);

        return queueSpecification;
    }
}

export type QueueSpecificationType = 'flow_run';
