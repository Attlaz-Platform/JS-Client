import {Endpoint} from './Endpoint';
import {Utils} from '../Utils';
import {Config} from '../Model/Config';
import {CollectionResult} from '../Model/Result/CollectionResult';
import {Parameters} from '../Http/Data/Parameters';

export class ConfigEndpoint extends Endpoint {

    public async getConfigByFlow(flowId: string, projectEnvironmentId: string | null = null): Promise<CollectionResult<Config>> {

        try {
            let parameters: Parameters | null = null;
            if (!Utils.isNullOrUndefined(projectEnvironmentId)) {
                parameters = {environment: projectEnvironmentId};
            }

            const result: CollectionResult<Config> = await this.requestCollection('/flows/' + flowId + '/configvalues', parameters, Config.parse);

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
            const result: CollectionResult<Config> = await this.requestCollection('/projectEnvironment/' + projectEnvironmentId + '/configvalues', null, Config.parse)
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
            const result: CollectionResult<Config> = await this.requestCollection(url, configs, Config.parse, 'POST');
            return result;
        } catch (e) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load config: ', e);
            }
            throw e;
        }

    }
}
