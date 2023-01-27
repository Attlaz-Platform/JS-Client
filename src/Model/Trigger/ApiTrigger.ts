import {Trigger} from './Trigger';
import {TriggerType} from './TriggerType';
import {ApiTriggerData} from './ApiTriggerData';

export class ApiTrigger extends Trigger {
    constructor(id: string, projectEnvironmentId: string, flowId: string, data: ApiTriggerData) {
        super(id, TriggerType.Api, projectEnvironmentId, flowId, data);
    }

    public getData(): ApiTriggerData {
        return super.getData() as ApiTriggerData;
    }
}
