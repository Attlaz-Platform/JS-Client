import { Job } from './Model/Job';
export declare class Client {
    private apiEndpoint;
    constructor(apiEndpoint: string);
    getJobs(): Array<Job>;
}
