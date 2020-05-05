import {ScheduleTriggerData} from './ScheduleTriggerData';
import {Trigger} from './Trigger';
import {TriggerType} from './TriggerType';

export class ScheduleTrigger extends Trigger {
    constructor(id: string, projectEnvironment: number, task: string, data: ScheduleTriggerData) {
        super(id, TriggerType.Schedule, projectEnvironment, task, data);
    }

    public getData(): ScheduleTriggerData {
        return super.getData() as ScheduleTriggerData;
    }
}
