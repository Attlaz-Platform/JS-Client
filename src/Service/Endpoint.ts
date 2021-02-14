import {OAuthClient} from '../Http/OAuthClient';
import {DataResult} from '../Model/Result/DataResult';

export abstract class Endpoint {
    protected httpClient: OAuthClient;

    public constructor(httpClient: OAuthClient) {
        this.httpClient = httpClient;
    }

    public async request<T>(action: string, parameters: any = null, method: string = 'GET', signWithOauthToken: boolean = true): Promise<DataResult<T>> {
        const result: any = await this.httpClient.request(action, parameters, method, signWithOauthToken);

        return DataResult.parse<T>(result);
    }

    public parseCollection<T>(dataResult: DataResult<any>, parser: (input: any) => T): T[] {
        const data: T[] = [];

        const rawData: T[] = dataResult.getData();
        for (const rawDataEntry of rawData) {
            data.push(parser(rawDataEntry));
        }

        dataResult.setData(data);

        return data;
    }

    // public parseCollection<T>(dataResult: DataResult<DataResultCollection<T[]>>, parser: any): DataResult<DataResultCollection<T[]>> {
    //     const data: T[] = [];
    //
    //     const rawData: T[] = dataResult.getData();
    //
    //     for (const rawDataEntry of rawData) {
    //         data.push(parser(rawDataEntry));
    //     }
    //
    //     dataResult.setData(data);
    //
    //     return dataResult;
    // }
}
