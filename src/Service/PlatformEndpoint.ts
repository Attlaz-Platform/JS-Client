import {Endpoint} from './Endpoint';
import {Platform} from '../Model/Worker/Platform';
import {PlatformImage} from '../Model/Worker/PlatformImage';
import {CollectionResult} from '../Model/Result/CollectionResult';

export class PlatformEndpoint extends Endpoint {

    public async getAll(): Promise<CollectionResult<Platform>> {
        let cmd: string = '/platforms';
        const result: CollectionResult<Platform> = await this.requestCollection(cmd, null, Platform.parse);
        return result;
    }

    public async getPlatformImages(platformId: string): Promise<CollectionResult<PlatformImage>> {
        let cmd: string = '/platforms/' + platformId + '/images';
        const result: CollectionResult<PlatformImage> = await this.requestCollection(cmd, null, PlatformImage.parse);
        return result;
    }
}
