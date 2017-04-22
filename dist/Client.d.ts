import { Job } from './Model/Job';
import { Branch } from "./Model/Branch";
import { JobSchedule } from "./Model/JobSchedule";
export declare class Client {
    private apiEndpoint;
    constructor(apiEndpoint: string);
    getJobsForBranch(branch: string): Promise<Array<Job>>;
    getBranches(): Promise<Array<Branch>>;
    getJobSchedulesByJobs(jobs: Array<Job>, from: Date, to: Date): Promise<Array<JobSchedule>>;
    getJobSchedules(job: Job, from: Date, to: Date): Promise<Array<JobSchedule>>;
}
