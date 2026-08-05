import {path} from '../Http/Data/Path.js';
import {CollectionResult} from '../Model/Result/CollectionResult.js';
import {CodeSourceBuildStrategy} from '../Model/Deployment/CodeSourceBuildStrategy.js';
import {CodeSourceRunStrategy} from '../Model/Deployment/CodeSourceRunStrategy.js';
import {Endpoint} from './Endpoint.js';

export class CodeSourceStrategiesEndpoint extends Endpoint {
    public async getAllBuildStrategies(workspaceId: string): Promise<CollectionResult<CodeSourceBuildStrategy>> {
        const cmd: string = path('/workspaces/:workspaceId/codesources/buildstrategies', {workspaceId});
        return await this.requestCollection(cmd, CodeSourceBuildStrategy.parse);
    }

    public async getAllRunStrategies(workspaceId: string): Promise<CollectionResult<CodeSourceRunStrategy>> {
        const cmd: string = path('/workspaces/:workspaceId/codesources/runstrategies', {workspaceId});
        return await this.requestCollection(cmd, CodeSourceRunStrategy.parse);
    }
}
