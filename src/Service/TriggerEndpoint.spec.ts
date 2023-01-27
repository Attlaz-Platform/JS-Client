import {Client} from '../Client';
import {Helper} from '../../e2e/src/helper';
import {Trigger} from '../Model/Trigger/Trigger';
import {State} from '../Model/State';

jest.setTimeout((60) * 1000);

const apiEndpoint: string = Helper.getEnvValue('apiEndpoint');
const clientCredentialClientId: string = Helper.getEnvValue('clientCredentialClientId');
const clientCredentialClientSecret: string = Helper.getEnvValue('clientCredentialClientSecret');

test('Test save trigger', async () => {

    // expect.assertions(3);

    let client: Client = new Client(apiEndpoint, clientCredentialClientId, clientCredentialClientSecret);
    client.getHttpClient().enableDebug();

    await client.authenticate();

    const trigger: Trigger | null = await client.getTriggerEndpoint().getById('11BF7E250');

    if (trigger === null) {
        throw new Error('Trigger not found');
    }
    let newState: State = State.Active;
    let oldState: State = State.Active;
    if (trigger.state === State.Active) {
        newState = State.Inactive;
        oldState = State.Active;
    } else if (trigger.state === State.Inactive) {
        newState = State.Active;
        oldState = State.Inactive;
    } else {
        throw new Error('Trigger must be either inactive or active');
    }
    trigger.state = newState;

    const savedTrigger: Trigger = await client.getTriggerEndpoint().save(trigger);

    expect(savedTrigger.state).toEqual(newState);

    savedTrigger.state = oldState;
    const savedTrigger2: Trigger = await client.getTriggerEndpoint().save(savedTrigger);

    expect(savedTrigger2.state).toEqual(oldState)

});

