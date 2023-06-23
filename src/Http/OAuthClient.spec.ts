import {OAuthClient} from './OAuthClient.js';
import {OAuthClientOptions} from './OAuthClientOptions.js';

test('Test enum parsing', async () => {

    const options: OAuthClientOptions = new OAuthClientOptions('https://github.com/login', '3b938da6f58d6bef7d59', 'da05698a6bd449de9437e11ff0b99003f511e40f', {'User-Agent': 'Attlaz Javascript Client/testing'});
    const client: OAuthClient = new OAuthClient(options);

    // client.getClient().cod.getToken()
    // const x: any = await client.authenticate();

    // console.log(x);
    // expect(TriggerType.fromString('webhook')).toBe(TriggerType.Webhook);
    // expect(TaskExecutionStatus.fromString('complete')).toBe(TaskExecutionStatus.Complete);
    // expect(ChannelType.fromString('slack')).toBe(ChannelType.Slack);
    // expect(LogLevel.fromString('debug')).toBe(LogLevel.Debug);
    // expect(ProjectDeployStatus.fromString('complete')).toBe(ProjectDeployStatus.Complete);
    // expect(StorageType.fromString('cache')).toBe(StorageType.Cache);
    // expect(State.fromString('active')).toBe(State.Active);
    // expect(WorkerInstanceState.fromString('started')).toBe(WorkerInstanceState.Started);
    // expect(WorkerState.fromString('active')).toBe(WorkerState.Active);
});
