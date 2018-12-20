import {EventType, LogLevel} from "../../";

export class Subscriber {
    public id: string;
    public eventTypes: EventType[];

    public team: string;
    public project: string;
    public task: string;
    public taskExecution: string;

    public channels: number[];
    public logLevelThreshold: LogLevel;

    constructor(id: string, eventTypes: EventType[], team: string, project: string, task: string, taskExecution: string, channels: number[], logLevelThreshold: LogLevel = null) {
        this.id = id;
        this.eventTypes = eventTypes;

        this.team = team;
        this.project = project;
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

}
