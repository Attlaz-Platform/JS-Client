import {WorkerInstanceState} from './WorkerInstanceState.js';

export class WorkerInstance {
    public id: string;
    public state: WorkerInstanceState = WorkerInstanceState.Stopped;

    public constructor(id: string) {
        this.id = id;
    }
}
