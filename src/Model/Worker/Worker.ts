import {WorkerState} from './WorkerState';
import {WorkerInstance} from './WorkerInstance';
import {WorkerInstanceState} from './WorkerInstanceState';

export class Worker {
    projectEnvironment: string;
    state: WorkerState;

    version: string;

    scale: number;

    public instances: WorkerInstance[];
    memoryLimit: number;

    public static parse(raw: any): Worker {
        const worker: Worker = new Worker();
        worker.projectEnvironment = raw.projectEnvironment;
        worker.state = WorkerState.fromString(raw.state);

        worker.version = raw.version;

        worker.scale = raw.scale;

        const rawInstances = raw.instances;
        worker.instances = [];
        for (let rawInstance of rawInstances) {
            const instance: WorkerInstance = new WorkerInstance(rawInstance.id);
            instance.state = WorkerInstanceState.fromString(rawInstance.state);
            worker.instances.push(instance);
        }

        worker.memoryLimit = raw.memoryLimit;

        return worker;
    }
}

