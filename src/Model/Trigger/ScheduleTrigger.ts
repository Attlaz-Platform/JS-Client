import {ScheduleTriggerData} from './ScheduleTriggerData.js';
import {Trigger} from './Trigger.js';
import {TriggerType} from './TriggerType.js';

export class ScheduleTrigger extends Trigger {
    constructor(id: string, projectEnvironmentId: string, flowId: string, data: ScheduleTriggerData) {
        super(id, TriggerType.Schedule, projectEnvironmentId, flowId, data);
    }

    public getData(): ScheduleTriggerData {
        return super.getData() as ScheduleTriggerData;
    }
}
