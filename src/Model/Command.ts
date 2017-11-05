import {CommandExecution} from "./CommandExecution";

export class Command {

    public id: number;
    public branch: number;
    public label: string;
    public task: string;
    public runExpression: string;
    public active: boolean;
    public params: object;

    public schedules: Array<CommandExecution>;

    constructor() {
        //this.schedules = [];
    }
}