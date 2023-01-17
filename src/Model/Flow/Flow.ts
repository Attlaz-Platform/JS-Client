import {State} from '../State';
import {Utils} from '../../Utils';
import {StateAware} from '../StateAware';
import {MetaDataAware} from '../../Core/MetaDataAware';
import {DataValueCollection} from '../DataValueCollection';

export class Flow extends MetaDataAware implements StateAware {
    public id: string;
    public key: string;
    public name: string;
    public description: string;
    public projectId: string;
    public isDirect: boolean = false;
    public state: State = State.Active;

    /** The maximum number of tasks to run at any time (0 = no limit) **/
    public parallelLimit: number = 0;

    public static parse(rawFlow: any): Flow {
        const task: Flow = new Flow();
        task.id = rawFlow.id;
        task.key = rawFlow.key;
        task.projectId = rawFlow.project;
        task.name = rawFlow.name;
        task.description = rawFlow.description;
        task.isDirect = Utils.isTrue(rawFlow.is_direct);
        task.state = State.fromString(rawFlow.state);
        task.parallelLimit = Utils.parseInt(rawFlow.parallel_limit);
        task.metadata = DataValueCollection.fromObject(rawFlow.metadata);
        return task;
    }
}
