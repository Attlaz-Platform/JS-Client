import {Parameters} from '../Data/Parameters.js';

export interface ITransport {
    request: <T>(action: string, parameters: Parameters, method: string, signWithOauthToken: boolean) => Promise<T>;

    isDebugEnabled: () => boolean;
}
