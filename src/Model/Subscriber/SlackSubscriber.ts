import {EventType, LogLevel, SlackSubscriberData, Subscriber} from "../../";

export class SlackSubscriber extends Subscriber {
    constructor(id: string, eventType: EventType, branch: string, task: string, data: SlackSubscriberData, logLevelThreshold: LogLevel = null, logLevelFilter: LogLevel[] = null) {
        super(id, eventType, branch, task, data, 'slack', logLevelThreshold, logLevelFilter);
    }

    public getData(): SlackSubscriberData {
        return <SlackSubscriberData>super.getData();
    }
}