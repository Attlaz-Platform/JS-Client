import {path} from '../Http/Data/Path.js';
import {Utils} from '../Utils.js';
import {Config} from '../Model/Config.js';
import {CollectionResult} from '../Model/Result/CollectionResult.js';
import {Parameters} from '../Http/Data/Parameters.js';
import {Endpoint} from './Endpoint.js';

export class ConfigEndpoint extends Endpoint {
    public async getConfigByFlow(flowId: string, projectEnvironmentId: string | null = null): Promise<CollectionResult<Config>> {
        try {
            let parameters: Parameters | null = null;
            if (!Utils.isNullOrUndefined(projectEnvironmentId)) {
                parameters = {environment: projectEnvironmentId};
            }

            const result: CollectionResult<Config> = await this.requestCollection(path('/flows/:flowId/configvalues', {flowId}), Config.parse, parameters);

            return result;
        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Unable to load flow configuration', error);
            }
            throw error;
        }
    }

    /**
     * The id is required: the API route is `/projectenvironments/:projectEnvironmentId/configvalues`
     * and 404s on an unknown environment. It used to default to null, which built
     * `/projectenvironments/null/configvalues` — a request that could never succeed.
     */
    public async getByProjectEnvironment(projectEnvironmentId: string): Promise<CollectionResult<Config>> {
        try {
            const result: CollectionResult<Config> = await this.requestCollection(path('/projectenvironments/:projectEnvironmentId/configvalues', {projectEnvironmentId}), Config.parse);
            return result;
        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Unable to load project configuration', error);
            }
            throw error;
        }
    }

    public async saveConfigs(projectId: string, configs: Config[]): Promise<CollectionResult<Config>> {
        try {
            const url: string = '/configvalues';
            const result: CollectionResult<Config> = await this.requestCollection(url, Config.parse, configs, 'POST');
            return result;
        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load config: ', error);
            }
            throw error;
        }
    }
}
