import {Endpoint} from './Endpoint.js';
import {Utils} from '../Utils.js';
import {Config} from '../Model/Config.js';
import {CollectionResult} from '../Model/Result/CollectionResult.js';
import {Parameters} from '../Http/Data/Parameters.js';

export class ConfigEndpoint extends Endpoint {

    public async getConfigByFlow(flowId: string, projectEnvironmentId: string | null = null): Promise<CollectionResult<Config>> {

        try {
            let parameters: Parameters | null = null;
            if (!Utils.isNullOrUndefined(projectEnvironmentId)) {
                parameters = {environment: projectEnvironmentId};
            }

            const result: CollectionResult<Config> = await this.requestCollection('/flows/' + flowId + '/configvalues', Config.parse, parameters);

            return result;
        } catch (e) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Unable to load flow configuration', e);
            }
            throw e;
        }

    }

    public async getByProjectEnvironment(projectEnvironmentId: string | null = null): Promise<CollectionResult<Config>> {

        try {
            const result: CollectionResult<Config> = await this.requestCollection('/projectenvironments/' + projectEnvironmentId + '/configvalues', Config.parse)
            return result;
        } catch (e) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Unable to load project configuration', e);
            }
            throw e;
        }

    }

    public async saveConfigs(projectId: string, configs: Config[]): Promise<CollectionResult<Config>> {

        try {
            let url: string = '/configvalues';
            const result: CollectionResult<Config> = await this.requestCollection(url, Config.parse, configs, 'POST');
            return result;
        } catch (e) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load config: ', e);
            }
            throw e;
        }

    }
}
