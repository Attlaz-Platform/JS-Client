import {Job} from './Model/Job';

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

    public getJobs(): Array<Job> {
        return [new Job(0, 0)];
    }
}