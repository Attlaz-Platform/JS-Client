import {Helper} from './helper.js';
import {Client, ClientError, HttpClient, HttpClientRequest, HttpClientResponse, HttpStatus, ObjectResult, ProjectEnvironment} from '../../src/index.js';
import {ApiError} from '../../src/Model/Error/ApiError.ts';

const useApiVersion: string = 'beta';
describe('Errors', () => {

    test('Api Offline', async () => {
        const nonExistingApiPoint: string = 'https://localhost:123';
        const client: Client = new Client('qsdfqsdfqsdf', {apiEndpoint: nonExistingApiPoint});

        const method = async (): Promise<void> => {
            const rawProjectEnvironment: ProjectEnvironment | null = await client.getProjectEnvironmentEndpoint().getById('2RYUhRnUlx7a9hm360g96Upn3Lc');
        }

        return method().catch(e => {

            const expectedError: ApiError = new ApiError('Service not available', HttpStatus.HTTP_UNAVAILABLE);
            expectedError.message = 'Service not available';

            expect(Object.assign({}, e)).toStrictEqual(Object.assign({}, expectedError));
        });

    });
    test('Bad Request', async () => {
        // A host that can never resolve: .invalid is reserved for exactly this (RFC 2606). This
        // used to be a free-tier ngrok subdomain, which is only unreachable until someone else
        // claims it — at which point the test would quietly stop testing an unreachable endpoint.
        const unreachableEndpoint: string = 'https://attlaz-api.invalid/projectenvironments/2RYUhRnUlx7a9hm360g96Upn3Lc';
        const client: Client = new Client('qsdfqsdfqsdf', {apiEndpoint: unreachableEndpoint});

        const method = async (): Promise<void> => {
            const rawProjectEnvironment: ProjectEnvironment | null = await client.getProjectEnvironmentEndpoint().getById('2RYUhRnUlx7a9hm360g96Upn3Lc');
        }

        return method().catch(e => {

            const expectedError: ClientError = new ClientError('ERR_BAD_REQUEST', HttpStatus.HTTP_BAD_REQUEST);
            expectedError.message = 'Request failed with status code 400';

            expect(Object.assign({}, e)).toStrictEqual(Object.assign({}, expectedError));
        });
    });
    test('Not found request', async () => {

        // expect.assertions(2);
        const client: Client = new Client('', {apiEndpoint: Helper.getApiEndpoint('live')});
        client.setClientCredentials(Helper.getEnvValue('clientCredentialClientId'), Helper.getEnvValue('clientCredentialClientSecret'));
        client.getHttpClient().enableDebug();

        await client.authenticate();

        const rawProjectEnvironment: ObjectResult<ProjectEnvironment> = await client.getProjectEnvironmentEndpoint().requestObject('/projectenvironments/qsdfqsdf/configurations/qsdf', null, (row: any) => {
            return row
        });
        expect(rawProjectEnvironment.getData()).toBeNull();

    });
    test('Unauthorized', async () => {
        const method = async (): Promise<void> => {
            const userRequest: HttpClientRequest = new HttpClientRequest('https://www.strava.com/api/v3/athlete', 'GET');
            userRequest.setHeader('Authorization', 'Bearer ' + 'hmmz');
            // userRequest.setHeader('Accept', 'application/json');
            userRequest.setJsonHeader();


            const userResponse: HttpClientResponse = await HttpClient.request(userRequest);
        }
        return method().catch(e => {

            const expectedError: ClientError = new ClientError('ERR_BAD_REQUEST', HttpStatus.HTTP_UNAUTHORIZED);
            expectedError.message = 'Unauthorized';

            console.log(Object.assign({}, expectedError));
            expect(Object.assign({}, e)).toStrictEqual(Object.assign({}, expectedError));
        });
    })

});
