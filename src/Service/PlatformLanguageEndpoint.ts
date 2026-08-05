import {path} from '../Http/Data/Path.js';
import {PlatformLanguage} from '../Model/Project/PlatformLanguage.js';
import {CollectionResult} from '../Model/Result/CollectionResult.js';
import {Endpoint} from './Endpoint.js';

export class PlatformLanguageEndpoint extends Endpoint {
    public async getAll(workspaceId: string): Promise<CollectionResult<PlatformLanguage>> {
        return await this.requestCollection(path('/workspaces/:workspaceId/platforms/languages', {workspaceId}), PlatformLanguage.parse);
    }
}
