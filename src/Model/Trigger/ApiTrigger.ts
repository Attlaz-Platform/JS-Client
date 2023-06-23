import {Trigger} from './Trigger.js';
import {TriggerType} from './TriggerType.js';
import {ApiTriggerData} from './ApiTriggerData.js';

export class ApiTrigger extends Trigger {
    constructor(id: string, projectEnvironmentId: string, flowId: string, data: ApiTriggerData) {
        super(id, TriggerType.Api, projectEnvironmentId, flowId, data);
    }

    public getData(): ApiTriggerData {
        return super.getData() as ApiTriggerData;
    }
}
