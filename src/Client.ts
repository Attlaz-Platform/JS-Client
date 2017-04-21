import {Job} from './Model/Job';
import {Branch} from "./Model/Branch";
import {JobSchedule} from "./Model/JobSchedule";

export class Client {
    private apiEndpoint = '';

    constructor(apiEndpoint: string) {
        this.apiEndpoint = apiEndpoint;
    }

    // get name() {
    //     return this._name;
    // }
    //
    // set name(value: string) {
    //     this._name = value;
    // }

    public getJobsForBranch(branch: string): Promise<Array<Job>> {
        return new Promise((resolve, reject) => {

            let jobs: Array<Job> = [];

            let job: Job = new Job();
            job.id = 0;
            job.branch = 0;
            job.label = 'Job1';
            job.task = 'Run job 1';
            job.runExpression = '* * * * * *';
            job.active = true;

            jobs.push(job);

            resolve(jobs);

        });
    }

    public getBranches(): Promise<Array<Branch>> {
        return new Promise((resolve, reject) => {

            let branches: Array<Branch> = [];

            let branch: Branch = new Branch();
            branch.id = 0;
            branch.code = 'branch1';
            branch.title = 'Branch1';


            branches.push(branch);

            resolve(branches);

        });
    }

    public getJobSchedulesByJobs(jobs: Array<Job>, from: Date, to: Date): Promise<Array<JobSchedule>> {

        return new Promise((resolve, reject) => {
            let promises: Array<Promise<Array<JobSchedule>>> = [];

            for (let job of jobs) {
                let p: Promise<Array<JobSchedule>> = this.getJobSchedules(job, from, to);
                promises.push(p);
            }


            Promise.all(promises).then((results) => {


                let jobSchedules: Array<JobSchedule> = [];
                for (let result of results) {

                    //TODO: merge would be faster (type check?)
                    for (let jobSchedule of result) {
                        jobSchedules.push(jobSchedule);
                    }


                }


                resolve(jobSchedules);
            });


        });

    }

    public getJobSchedules(job: Job, from: Date, to: Date): Promise<Array<JobSchedule>> {
        return new Promise((resolve, reject) => {

            let jobSchedules: Array<JobSchedule> = [];
//Future jobSchedule
            let jobSchedule: JobSchedule = new JobSchedule();
            jobSchedule.id = 0;
            jobSchedule.job = job.id;
            jobSchedule.forced = false;
            jobSchedule.status = 'waiting';
            jobSchedule.created = new Date('2017-02-09 10:15');
            jobSchedule.scheduled = new Date((new Date()).getTime() + (1000 * 60));

            jobSchedules.push(jobSchedule);
//Running jobSchedule
            let jobSchedule2: JobSchedule = new JobSchedule();
            jobSchedule2.id = 1;
            jobSchedule2.job = job.id;
            jobSchedule2.forced = false;
            jobSchedule2.status = 'running';
            jobSchedule2.created = new Date('2017-02-09 10:15');
            jobSchedule2.scheduled = new Date((new Date()).getTime() - (1000 * 60));

            jobSchedules.push(jobSchedule2);

            //Completed jobSchedule
            let jobSchedule3: JobSchedule = new JobSchedule();
            jobSchedule3.id = 2;
            jobSchedule3.job = job.id;
            jobSchedule3.forced = false;
            jobSchedule3.status = 'finished';
            jobSchedule3.created = new Date('2017-02-09 10:15');
            jobSchedule3.scheduled = new Date((new Date()).getTime() - (2000 * 60));
            jobSchedule3.executed = new Date((new Date()).getTime() - (2000 * 60));
            jobSchedule3.finished = new Date((new Date()).getTime());

            jobSchedules.push(jobSchedule3);
            //Completed jobSchedule
            let jobSchedule4: JobSchedule = new JobSchedule();
            jobSchedule4.id = 3;
            jobSchedule4.job = job.id;
            jobSchedule4.forced = false;
            jobSchedule4.status = 'failed';
            jobSchedule4.created = new Date('2017-02-09 10:15');
            jobSchedule4.scheduled = new Date((new Date()).getTime() - (2000 * 60));
            jobSchedule4.executed = new Date((new Date()).getTime() - (2000 * 60));
            jobSchedule4.finished = new Date((new Date()).getTime());

            jobSchedules.push(jobSchedule4);

            resolve(jobSchedules);

        });
    }


}