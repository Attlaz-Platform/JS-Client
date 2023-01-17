import {Endpoint} from './Endpoint';
import {CollectionResult} from '../Model/Result/CollectionResult';
import {CodeSourceBuildStrategy} from '../Model/Deployment/CodeSourceBuildStrategy';


export class CodeSourceBuildStrategyEndpoint extends Endpoint {

    public async getAll(workspaceId: string): Promise<CollectionResult<CodeSourceBuildStrategy>> {

        let cmd: string = '/workspaces/' + workspaceId + '/codesourcedeploystrategies';
        const result: CollectionResult<CodeSourceBuildStrategy> = await this.requestCollection(cmd, null, CodeSourceBuildStrategy.parse);
        return result;

        return result;
    }

}
