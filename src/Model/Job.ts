import {JobSchedule} from "./JobSchedule";
export class Job {

    public id: number;
    public branch: number;
    public label: string;
    public task: string;
    public runExpression: string;
    public active: boolean;

    public schedules: Array<JobSchedule>;

    constructor() {
        //this.schedules = [];
    }
}