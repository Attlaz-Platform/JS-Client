import { JobSchedule } from "./JobSchedule";
export declare class Job {
    id: number;
    branch: number;
    label: string;
    task: string;
    runExpression: string;
    active: boolean;
    schedules: Array<JobSchedule>;
    constructor();
}
