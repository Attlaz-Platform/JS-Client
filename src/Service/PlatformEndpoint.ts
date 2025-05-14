import {Platform} from '../Model/Worker/Platform.js';
import {PlatformImage} from '../Model/Worker/PlatformImage.js';
import {CollectionResult} from '../Model/Result/CollectionResult.js';
import {CursorPagination} from '../Model/Pagination/CursorPagination.js';
import {QueryString} from '../Http/Data/QueryString.js';
import {Endpoint} from './Endpoint.js';

export class PlatformEndpoint extends Endpoint {
    public async getAll(workspaceId: string | null, pagination: CursorPagination): Promise<CollectionResult<Platform>> {
        const qs: QueryString = new QueryString('/workspaces/' + (workspaceId === null ? 'all' : workspaceId) + '/platforms')
        qs.addPagination(pagination);
        const result: CollectionResult<Platform> = await this.requestCollection(qs, Platform.parse);
        return result;
    }

    public async getPlatformImages(workspaceId: string | null, platformId: string, pagination: CursorPagination): Promise<CollectionResult<PlatformImage>> {
        const qs: QueryString = new QueryString('/workspaces/' + (workspaceId === null ? 'all' : workspaceId) + '/platforms/' + platformId + '/images')
        qs.addPagination(pagination);
        const result: CollectionResult<PlatformImage> = await this.requestCollection(qs, PlatformImage.parse);
        return result;
    }
}
