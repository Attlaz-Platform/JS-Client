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

    public getConfigByBranch(branchId: string): Promise<Config[]> {
        return new Promise<Config[]>((resolve, reject) => {
            this.httpClient.request('/branches/' + branchId + '/config').then((rawConfigs: any) => {

                let configs: Config[] = [];
                for (let rawConfig of rawConfigs) {

                    configs.push(Config.parse(rawConfig));
                }
                resolve(configs);

            }).catch((reason) => {
                if (this.httpClient.isDebugEnabled()) {
                    console.error('Unable to load branch configuration', reason);
                }
                reject(reason);
            });

        });
    }

    public postConfigsByBranch(branchId: string, configs: Config[]): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            let url: string = '/branches/' + branchId + '/config';

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