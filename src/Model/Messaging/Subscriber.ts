import {State} from '../State';
import {EventType} from '../Event/EventType';
import {LogLevel} from '../Log/LogLevel';
import {StateAware} from '../StateAware';
import {MetaDataAware} from '../../Core/MetaDataAware';
import {DataValueCollection} from '../DataValueCollection';

export class Subscriber extends MetaDataAware implements StateAware {
    public id: string;
    public eventTypes: EventType[];

    public projectEnvironment: string;
    public task: string;
    public taskExecution: string;

    public channels: string[];
    public logLevelThreshold: LogLevel;
    public state: State = State.Active;

    constructor(id: string, eventTypes: EventType[], projectEnvironment: string, task: string, taskExecution: string, channels: string[], logLevelThreshold: LogLevel = LogLevel.Debug) {
        super();
        this.id = id;
        this.eventTypes = eventTypes;

        this.projectEnvironment = projectEnvironment;
        this.task = task;
        this.taskExecution = taskExecution;

        this.channels = channels;
        this.logLevelThreshold = logLevelThreshold;

    }

    public static parseRaw(rawSubscriber: any): Subscriber {
        let subscriber: Subscriber = new Subscriber(rawSubscriber.id, rawSubscriber.eventTypes, rawSubscriber.projectEnvironment, rawSubscriber.task, rawSubscriber.task_execution, rawSubscriber.channels, rawSubscriber.logLevelThreshold);
        subscriber.state = State.fromString(rawSubscriber.state);
        subscriber.metadata = DataValueCollection.fromObject(rawSubscriber.metadata);
        return subscriber;
    }

    public getLogLevelThreshold(): LogLevel {
        return this.logLevelThreshold;
    }

    public hasLogLevelThreshold(): boolean {
        return this.logLevelThreshold !== null;
    }

}
