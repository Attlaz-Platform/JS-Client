import {Trigger} from './Trigger';
import {TriggerType} from './TriggerType';
import {ApiTriggerData} from './ApiTriggerData';

export class ApiTrigger extends Trigger {
    constructor(id: string, projectEnvironment: number, task: string, data: ApiTriggerData) {
        super(id, TriggerType.Api, projectEnvironment, task, data);
    }

    public getData(): ApiTriggerData {
        return super.getData() as ApiTriggerData;
    }
}
