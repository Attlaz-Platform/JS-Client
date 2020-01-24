import {EventType, LogLevel} from "../../";
import {State} from '../State';

export class Subscriber {
    public id: string;
    public eventTypes: EventType[];

    public team: string;
    public project: string;
    public projectEnvironment: number;
    public task: string;
    public taskExecution: string;

    public channels: number[];
    public logLevelThreshold: LogLevel;
    public state: State = State.Active;

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
