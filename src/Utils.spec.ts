import {TriggerType} from './Model/Trigger/TriggerType';
import {TaskExecutionStatus} from './Model/TaskExecutionStatus';

test('Test enum parsing', () => {

    expect(TriggerType.fromString('webhook')).toBe(TriggerType.Webhook);
    expect(TaskExecutionStatus.fromString('complete')).toBe(TaskExecutionStatus.Complete);

});
