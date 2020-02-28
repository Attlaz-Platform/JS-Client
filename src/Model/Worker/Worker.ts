import {WorkerState} from './WorkerState';

export class Worker {
    projectEnvironment: number;
    state: WorkerState;

    imageId: number;

    scale: number;
    memoryLimit: number;

    public static parse(raw: any): Worker {
        const worker: Worker = new Worker();
        worker.projectEnvironment = raw.projectEnvironment;
        worker.state = WorkerState.fromString(raw.state);

        worker.imageId = raw.imageId;

        worker.scale = raw.scale;
        worker.memoryLimit = raw.memoryLimit;

        return worker;
    }
}

