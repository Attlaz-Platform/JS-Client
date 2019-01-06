import {TriggerData} from "./TriggerData";
import {State} from '../State';

export class Trigger {
    public id: string;
    public type: string;
    public project: string;
    public projectEnvironment: number;
    public task: string;
    public arguments: {};
    public data: TriggerData;
    public state: State = State.Active;

    constructor(id: string, type: string, project: string, task: string, data: TriggerData) {
        this.id = id;
        this.type = type;
        this.project = project;
        this.task = task;
        this.data = data;

        this.arguments = [];
    }

    public getData(): TriggerData {
        return this.data;
    }
}
