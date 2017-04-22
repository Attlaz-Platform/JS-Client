import { CommandExecution } from "./CommandExecution";
export declare class Command {
    id: number;
    branch: number;
    label: string;
    task: string;
    runExpression: string;
    active: boolean;
    schedules: Array<CommandExecution>;
    constructor();
}
