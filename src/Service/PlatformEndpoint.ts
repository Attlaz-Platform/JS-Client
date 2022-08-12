import {Endpoint} from './Endpoint';
import {Platform} from '../Model/Worker/Platform';
import {PlatformImage} from '../Model/Worker/PlatformImage';
import {DataResult} from '../Model/Result/DataResult';

export class PlatformEndpoint extends Endpoint {

    public async getAll(): Promise<DataResult<Platform[]>> {
        let cmd: string = '/platforms';
        const result: DataResult<Platform[]> = await this.request(cmd);
        result.setData(this.parseCollection(result, Platform.parse));
        return result;
    }

    public async getPlatformImages(platformId: string): Promise<DataResult<PlatformImage[]>> {
        let cmd: string = '/platforms/' + platformId + '/images';
        const result: DataResult<PlatformImage[]> = await this.request(cmd);
        result.setData(this.parseCollection(result, PlatformImage.parse));
        return result;
    }
}
