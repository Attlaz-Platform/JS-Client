import {TriggerData} from "./TriggerData";

export class Trigger {
    public id: string;
    public type: string;
    public branch: string;
    public task: string;
    public arguments: {};
    public data: TriggerData;
    public enabled: boolean = true;

    constructor(id: string, type: string, branch: string, task: string, data: TriggerData) {
        this.id = id;
        this.type = type;
        this.branch = branch;
        this.task = task;
        this.data = data;

        this.arguments = [];
    }

    public getData(): TriggerData {
        return this.data;
    }
}
