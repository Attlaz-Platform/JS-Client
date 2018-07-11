import {Endpoint,Config} from "..";

export class ConfigEndpoint extends Endpoint {

    public getConfigByTask(taskId: string): Promise<Config[]> {
        return new Promise<Config[]>((resolve, reject) => {
            this.httpClient.request('/branch/' + this.httpClient.getBranchId() + '/task/' + taskId + '/config').then((rawConfigs: any) => {

                let configs: Config[] = [];
                for (let rawConfig of rawConfigs) {

                    configs.push(Config.parse(rawConfig));
                }
                resolve(configs);

            }).catch((reason) => {
                console.error('Unable to load task configuration', reason);
                reject(reason);
            });

        });
    }

    public getConfigByBranch(): Promise<Config[]> {
        return new Promise<Config[]>((resolve, reject) => {
            this.httpClient.request('/branch/' + this.httpClient.getBranchId() + '/config').then((rawConfigs: any) => {

                let configs: Config[] = [];
                for (let rawConfig of rawConfigs) {

                    configs.push(Config.parse(rawConfig));
                }
                resolve(configs);

            }).catch((reason) => {
                console.error('Unable to load branch configuration', reason);
                reject(reason);
            });

        });
    }

    public postConfigsByBranch(configs: Config[]): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            let url: string = '/branch/' + this.httpClient.getBranchId() + '/config';

            this.httpClient.request(url, configs, 'POST').then((result: any) => {

                resolve(result);

            }).catch((reason) => {
                console.log('Failed to load config: ', reason);
                reject(reason);
            });

        });
    }
}