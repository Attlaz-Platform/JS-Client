import {Client} from '../Client.js';
import {Helper} from '../../e2e/src/helper.js';
import {Trigger} from '../Model/Trigger/Trigger.js';
import {State} from '../Model/State.js';
import {CollectionResult} from '../Model/Result/CollectionResult.js';

jest.setTimeout((60) * 1000);

const apiEndpoint: string = Helper.getEnvValue('apiEndpoint');
const clientCredentialClientId: string = Helper.getEnvValue('clientCredentialClientId');
const clientCredentialClientSecret: string = Helper.getEnvValue('clientCredentialClientSecret');

describe('Trigger endpoint', () => {
    test('Get flow run triggers', async () => {
        const client: Client = new Client('', {apiEndpoint: apiEndpoint});
        client.setClientCredentials(clientCredentialClientId, clientCredentialClientSecret);
        client.getHttpClient().enableDebug();

        const flowTriggers: CollectionResult<Trigger> = await client.getTriggerEndpoint().getByFlow('123JKhnLyN5nS4eY9GD2JhEbEbm');

        expect(flowTriggers.getData().length).toBeGreaterThan(0);
    });
    test('Get code source deploy triggers', async () => {
        const client: Client = new Client('', {apiEndpoint: apiEndpoint});
        client.setClientCredentials(clientCredentialClientId, clientCredentialClientSecret);
        client.getHttpClient().enableDebug();

        const codeSourceDeployTriggers: CollectionResult<Trigger> = await client.getTriggerEndpoint().getByCodeSource('123JKhnLyN5nS4eY9GD2JhEbEbm');

        expect(codeSourceDeployTriggers.getData().length).toBeGreaterThan(0);
    });
    test('Test save trigger', async () => {
        // expect.assertions(3);

        const client: Client = new Client('', {apiEndpoint: apiEndpoint});
        client.setClientCredentials(clientCredentialClientId, clientCredentialClientSecret);
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

        expect(savedTrigger2.state).toEqual(oldState);
    });
});
