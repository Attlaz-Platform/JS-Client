import {ScheduleTriggerData} from './ScheduleTriggerData';
import {Trigger} from './Trigger';
import {TriggerType} from './TriggerType';

export class ScheduleTrigger extends Trigger {
    constructor(id: string, project: string, task: string, data: ScheduleTriggerData) {
        super(id, TriggerType.Schedule, project, task, data);
    }

    public getData(): ScheduleTriggerData {
        return super.getData() as ScheduleTriggerData;
    }
}
