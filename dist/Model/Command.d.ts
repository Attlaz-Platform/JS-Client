import { CommandExecution } from "./CommandExecution";
export declare class Command {
    id: number;
    branch: number;
    label: string;
    task: string;
    runExpression: string;
    active: boolean;
    params: object;
    schedules: Array<CommandExecution>;
    constructor();
}
