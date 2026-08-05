import {path} from '../Http/Data/Path.js';
import {Platform} from '../Model/Worker/Platform.js';
import {PlatformImage} from '../Model/Worker/PlatformImage.js';
import {CollectionResult} from '../Model/Result/CollectionResult.js';
import {CursorPagination} from '../Model/Pagination/CursorPagination.js';
import {QueryString} from '../Http/Data/QueryString.js';
import {Endpoint} from './Endpoint.js';

export class PlatformEndpoint extends Endpoint {
    public async getAll(workspaceId: string | null, pagination: CursorPagination): Promise<CollectionResult<Platform>> {
        const qs: QueryString = new QueryString(path('/workspaces/:workspaceId/platforms', {workspaceId: workspaceId === null ? 'all' : workspaceId}))
        qs.addPagination(pagination);
        const result: CollectionResult<Platform> = await this.requestCollection(qs, Platform.parse);
        return result;
    }

    public async getPlatformImages(workspaceId: string | null, platformId: string, pagination: CursorPagination): Promise<CollectionResult<PlatformImage>> {
        const qs: QueryString = new QueryString(path('/workspaces/:workspaceId/platforms/:platformId/images', {workspaceId: workspaceId === null ? 'all' : workspaceId, platformId}))
        qs.addPagination(pagination);
        const result: CollectionResult<PlatformImage> = await this.requestCollection(qs, PlatformImage.parse);
        return result;
    }
}
