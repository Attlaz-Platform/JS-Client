import {State} from '../State';
import {Utils} from '../../Utils';
import {StateAware} from '../StateAware';

export class Flow implements StateAware {
    public id: string;
    public key: string;
    public name: string;
    public description: string;
    public projectId: string;
    public isDirect: boolean = false;
    public state: State = State.Active;

    /** The maximum number of tasks to run at any time (0 = no limit) **/
    public parallelLimit: number = 0;

    public static parse(rawTask: any): Flow {
        const task: Flow = new Flow();
        task.id = rawTask.id;
        task.key = rawTask.key;
        task.projectId = rawTask.project;
        task.name = rawTask.name;
        task.description = rawTask.description;
        task.isDirect = Utils.isTrue(rawTask.is_direct);
        task.state = State.fromString(rawTask.state);
        task.parallelLimit = Utils.parseInt(rawTask.parallel_limit);

        return task;
    }
}
