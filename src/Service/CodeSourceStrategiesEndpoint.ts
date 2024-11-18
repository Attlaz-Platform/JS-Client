import {CollectionResult} from '../Model/Result/CollectionResult.js';
import {CodeSourceBuildStrategy} from '../Model/Deployment/CodeSourceBuildStrategy.js';
import {CodeSourceRunStrategy} from '../Model/Deployment/CodeSourceRunStrategy.js';
import {Endpoint} from './Endpoint.js';

export class CodeSourceStrategiesEndpoint extends Endpoint {
    public async getAllBuildStrategies(workspaceId: string): Promise<CollectionResult<CodeSourceBuildStrategy>> {
        const cmd: string = '/workspaces/' + workspaceId + '/codesources/buildstrategies';
        return await this.requestCollection(cmd, CodeSourceBuildStrategy.parse);
    }

    public async getAllRunStrategies(workspaceId: string): Promise<CollectionResult<CodeSourceRunStrategy>> {
        const cmd: string = '/workspaces/' + workspaceId + '/codesources/runstrategies';
        return await this.requestCollection(cmd, CodeSourceRunStrategy.parse);
    }
}
