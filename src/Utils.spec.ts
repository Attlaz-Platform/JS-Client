import {TriggerType} from './Model/Trigger/TriggerType';
import {TaskExecutionStatus} from './Model/TaskExecutionStatus';
import {ChannelType} from './Model/Messaging/Channel/ChannelType';
import {ProjectDeployStatus} from './Model/Project/ProjectDeployStatus';
import {State} from './Model/State';
import {LogLevel} from './Model/Log/LogLevel';
import {StorageType} from './Model/Storage/StorageType';
import {WorkerInstanceState} from './Model/Worker/WorkerInstanceState';
import {WorkerState} from './Model/Worker/WorkerState';

test('Test enum parsing', () => {

    expect(TriggerType.fromString('webhook')).toBe(TriggerType.Webhook);
    expect(TaskExecutionStatus.fromString('complete')).toBe(TaskExecutionStatus.Complete);
    expect(ChannelType.fromString('slack')).toBe(ChannelType.Slack);
    expect(LogLevel.fromString('debug')).toBe(LogLevel.Debug);
    expect(ProjectDeployStatus.fromString('complete')).toBe(ProjectDeployStatus.Complete);
    expect(StorageType.fromString('cache')).toBe(StorageType.Cache);
    expect(State.fromString('active')).toBe(State.Active);
    expect(WorkerInstanceState.fromString('started')).toBe(WorkerInstanceState.Started);
    expect(WorkerState.fromString('active')).toBe(WorkerState.Active);
});
