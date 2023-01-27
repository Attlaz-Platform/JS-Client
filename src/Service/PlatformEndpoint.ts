import {Endpoint} from './Endpoint';
import {Platform} from '../Model/Worker/Platform';
import {PlatformImage} from '../Model/Worker/PlatformImage';
import {CollectionResult} from '../Model/Result/CollectionResult';

export class PlatformEndpoint extends Endpoint {

    public async getAll(workspaceId: string): Promise<CollectionResult<Platform>> {
        let cmd: string = '/workspaces/' + workspaceId + '/platforms';
        const result: CollectionResult<Platform> = await this.requestCollection(cmd,  Platform.parse);
        return result;
    }

    public async getPlatformImages(workspaceId: string, platformId: string): Promise<CollectionResult<PlatformImage>> {
        let cmd: string = '/workspaces/' + workspaceId + '/platforms/' + platformId + '/images';
        const result: CollectionResult<PlatformImage> = await this.requestCollection(cmd,  PlatformImage.parse);
        return result;
    }
}
