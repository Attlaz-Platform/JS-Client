import {Adapter, Endpoint} from "..";

export class AdapterEndpoint extends Endpoint {

    public getAdapters(): Promise<Adapter[]> {
        return new Promise<Adapter[]>((resolve, reject) => {
            this.httpClient.request('adapters').then((rawAdapters: any) => {

                let adapters: Adapter[] = [];
                for (let rawAdapter of rawAdapters) {

                    adapters.push(Adapter.parse(rawAdapter));
                }

                resolve(adapters);

            }).catch((reason) => {
                if(this.httpClient.isDebugEnabled())
                {
                    console.error('Failed to load branches: ' + reason);
                }

                reject(reason);
            });
        });

    }

}