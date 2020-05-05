import {EventType, LogLevel} from "../../";
import {State} from '../State';

export class Subscriber {
    public id: string;
    public eventTypes: EventType[];

    public projectEnvironment: number;
    public task: string;
    public taskExecution: string;

    public channels: number[];
    public logLevelThreshold: LogLevel;
    public state: State = State.Active;

    constructor(id: string, eventTypes: EventType[], projectEnvironment: number, task: string, taskExecution: string, channels: number[], logLevelThreshold: LogLevel = null) {
        this.id = id;
        this.eventTypes = eventTypes;

        this.projectEnvironment = projectEnvironment;
        this.task = task;
        this.taskExecution = taskExecution;

        this.channels = channels;
        this.logLevelThreshold = logLevelThreshold;

    }

    public getLogLevelThreshold(): LogLevel {
        return this.logLevelThreshold;
    }

    public hasLogLevelThreshold(): boolean {
        return this.logLevelThreshold !== null;
    }

    public static parseRaw(rawSubscriber: any): Subscriber {
        let subscriber: Subscriber = new Subscriber(rawSubscriber.id, rawSubscriber.eventTypes, rawSubscriber.projectEnvironment, rawSubscriber.task, rawSubscriber.task_execution, rawSubscriber.channels, rawSubscriber.logLevelThreshold);
        subscriber.state = State.fromString(rawSubscriber.state);

        return subscriber;
    }

}
