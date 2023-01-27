import {ScheduleTriggerData} from './ScheduleTriggerData';
import {Trigger} from './Trigger';
import {TriggerType} from './TriggerType';

export class ScheduleTrigger extends Trigger {
    constructor(id: string, projectEnvironmentId: string, flowId: string, data: ScheduleTriggerData) {
        super(id, TriggerType.Schedule, projectEnvironmentId, flowId, data);
    }

    public getData(): ScheduleTriggerData {
        return super.getData() as ScheduleTriggerData;
    }
}
