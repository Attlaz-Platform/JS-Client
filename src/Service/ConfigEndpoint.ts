import {Config, Endpoint} from "..";

export class ConfigEndpoint extends Endpoint {

    public getConfigByTask(taskId: string): Promise<Config[]> {
        return new Promise<Config[]>((resolve, reject) => {
            this.httpClient.request('/tasks/' + taskId + '/config').then((rawConfigs: any) => {

                let configs: Config[] = [];
                for (let rawConfig of rawConfigs) {

                    configs.push(Config.parse(rawConfig));
                }
                resolve(configs);

            }).catch((reason) => {
                if (this.httpClient.isDebugEnabled()) {
                    console.error('Unable to load task configuration', reason);
                }

                reject(reason);
            });

        });
    }

    public getByProject(projectId: string): Promise<Config[]> {
        return new Promise<Config[]>((resolve, reject) => {
            this.httpClient.request('/projects/' + projectId + '/config').then((rawConfigs: any) => {

                let configs: Config[] = [];
                for (let rawConfig of rawConfigs) {

                    configs.push(Config.parse(rawConfig));
                }
                resolve(configs);

            }).catch((reason) => {
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

            }).catch((reason) => {
                if (this.httpClient.isDebugEnabled()) {
                    console.error('Failed to load config: ', reason);
                }
                reject(reason);
            });

        });
    }
}