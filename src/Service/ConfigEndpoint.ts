import {Config, Endpoint, Utils} from "..";

export class ConfigEndpoint extends Endpoint {

    public getConfigByTask(taskId: string, projectEnvironmentId: number = null): Promise<Config[]> {
        return new Promise<Config[]>((resolve, reject) => {

            let parameters: any = null;
            if (!Utils.isNullOrUndefined(projectEnvironmentId)) {
                parameters = {environment: projectEnvironmentId};
            }

            this.httpClient.request('/tasks/' + taskId + '/config', parameters).then((rawConfigs: any) => {

                let configs: Config[] = [];
                for (let rawConfig of rawConfigs) {

                    configs.push(Config.parse(rawConfig));
                }
                resolve(configs);

            }).catch((reason: any) => {
                if (this.httpClient.isDebugEnabled()) {
                    console.error('Unable to load task configuration', reason);
                }

                reject(reason);
            });

        });
    }

    public getByProject(projectId: string, projectEnvironmentId: number = null): Promise<Config[]> {
        return new Promise<Config[]>((resolve, reject) => {

            let parameters: any = null;
            if (!Utils.isNullOrUndefined(projectEnvironmentId)) {
                parameters = {environment: projectEnvironmentId};
            }

            this.httpClient.request('/projects/' + projectId + '/config', parameters).then((rawConfigs: any) => {

                let configs: Config[] = [];
                for (let rawConfig of rawConfigs) {

                    configs.push(Config.parse(rawConfig));
                }
                resolve(configs);

            }).catch((reason: any) => {
                if (this.httpClient.isDebugEnabled()) {
                    console.error('Unable to load project configuration', reason);
                }
                reject(reason);
            });

        });
    }

    public saveByProject(projectId: string, configs: Config[]): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            let url: string = '/projects/' + projectId + '/config';

            this.httpClient.request(url, configs, 'POST').then((result: any) => {

                resolve(result);

            }).catch((reason: any) => {
                if (this.httpClient.isDebugEnabled()) {
                    console.error('Failed to load config: ', reason);
                }
                reject(reason);
            });

        });
    }
}
