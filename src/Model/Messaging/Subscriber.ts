import {State} from '../State.js';
import {EventType} from '../Event/EventType.js';
import {LogLevel} from '../Log/LogLevel.js';
import {StateAware} from '../StateAware.js';
import {MetaDataAware} from '../../Core/MetaDataAware.js';
import {DataValueCollection} from '../DataValueCollection.js';

export class Subscriber extends MetaDataAware implements StateAware {
    public id: string;
    public eventTypes: EventType[];

    public projectEnvironmentId: string;
    public flowId: string;
    public flowRunId: string;
    public channelIds: string[];
    public logLevelThreshold: LogLevel;
    public state: State = State.Active;

    constructor(id: string, eventTypes: EventType[], projectEnvironmentId: string, flowId: string, flowRunId: string, channelIds: string[], logLevelThreshold: LogLevel = LogLevel.Debug) {
        super();
        this.id = id;
        this.eventTypes = eventTypes;

        this.projectEnvironmentId = projectEnvironmentId;
        this.flowId = flowId;
        this.flowRunId = flowRunId;

        this.channelIds = channelIds;
        this.logLevelThreshold = logLevelThreshold;
    }

    public static parseRaw(rawSubscriber: any): Subscriber {
        const subscriber: Subscriber = new Subscriber(rawSubscriber.id, rawSubscriber.event_types, rawSubscriber.project_environment, rawSubscriber.flow, rawSubscriber.flow_run, rawSubscriber.channels, rawSubscriber.log_level_threshold);
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
