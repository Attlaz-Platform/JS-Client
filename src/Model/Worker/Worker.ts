import {WorkerState} from './WorkerState.js';
import {WorkerInstance} from './WorkerInstance.js';
import {WorkerInstanceState} from './WorkerInstanceState.js';

export class Worker {
    projectEnvironment: string;
    state: WorkerState;

    version: string;

    scale: number;

    public instances: WorkerInstance[];
    memoryLimit: number;

    public static parse(raw: any): Worker {
        const worker: Worker = new Worker();
        worker.projectEnvironment = raw.project_environment;
        worker.state = WorkerState.fromString(raw.state);

        worker.version = raw.version;

        worker.scale = raw.scale;

        const rawInstances = raw.instances;
        worker.instances = [];
        for (const rawInstance of rawInstances) {
            const instance: WorkerInstance = new WorkerInstance(rawInstance.id);
            instance.state = WorkerInstanceState.fromString(rawInstance.state);
            worker.instances.push(instance);
        }

        worker.memoryLimit = raw.memory_limit;

        return worker;
    }
}
