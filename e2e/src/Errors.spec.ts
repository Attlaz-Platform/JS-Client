import {Helper} from './helper.js';
import {Client, ClientError, HttpStatus, ObjectResult, ProjectEnvironment} from '../../src/index.js';

const useApiVersion: string = 'beta';
describe('Errors', () => {


    test('Api Offline', async () => {
        const nonExistingApiPoint: string = 'https://localhost:123';
        const client: Client = new Client('qsdfqsdfqsdf', {apiEndpoint: nonExistingApiPoint});

        const z = async (): Promise<Error | null> => {

            try {
                const rawProjectEnvironment: ProjectEnvironment | null = await client.getProjectEnvironmentEndpoint().getById('2RYUhRnUlx7a9hm360g96Upn3Lc');
            } catch (e: any) {
                return e;
            }
            return null;
        }

        const error: ClientError = new ClientError('ERR_BAD_REQUEST', HttpStatus.HTTP_BAD_REQUEST);
        error.message = 'Connection refused';
        expect(await z()).toStrictEqual(error);
    });
    test('Bad Request', async () => {
        /**
         * Start up Ngrok but don't start our API yet
         */
        const nonWorkingNgrokEndpoint: string = ' https://champion-pleasant-sunfish.ngrok-free.app/projectenvironments/2RYUhRnUlx7a9hm360g96Upn3Lc';
        const client: Client = new Client('qsdfqsdfqsdf', {apiEndpoint: nonWorkingNgrokEndpoint});

        const z = async (): Promise<Error | null> => {
            try {
                const rawProjectEnvironment: ProjectEnvironment | null = await client.getProjectEnvironmentEndpoint().getById('2RYUhRnUlx7a9hm360g96Upn3Lc');
            } catch (e: any) {
                return e;
            }
            return null;
        }

        const error: ClientError = new ClientError('ERR_BAD_REQUEST', HttpStatus.HTTP_BAD_REQUEST);
        error.message = 'Request failed with status code 400';
        expect(await z()).toStrictEqual(error);
    });
    test('Not found request', async () => {

        // expect.assertions(2);
        const client: Client = new Client('', {apiEndpoint: Helper.getApiEndpoint('beta')});
        client.setClientCredentials(Helper.getEnvValue('clientCredentialClientId'), Helper.getEnvValue('clientCredentialClientSecret'));
        client.getHttpClient().enableDebug();

        await client.authenticate();

        const rawProjectEnvironment: ObjectResult<ProjectEnvironment> = await client.getProjectEnvironmentEndpoint().requestObject('/projectenvironments/qsdfqsdf/configurations/qsdf', null, (row: any) => {
            return row
        });
        expect(rawProjectEnvironment.getData()).toBeNull();

    });

});
