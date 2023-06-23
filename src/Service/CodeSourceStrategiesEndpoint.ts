import {Endpoint} from './Endpoint.js';
import {CollectionResult} from '../Model/Result/CollectionResult.js';
import {CodeSourceBuildStrategy} from '../Model/Deployment/CodeSourceBuildStrategy.js';
import {CodeSourceRunStrategy} from '../Model/Deployment/CodeSourceRunStrategy.js';


export class CodeSourceStrategiesEndpoint extends Endpoint {

    public async getAllDeployStrategies(workspaceId: string): Promise<CollectionResult<CodeSourceBuildStrategy>> {

        let cmd: string = '/workspaces/' + workspaceId + '/codesources/deploystrategies';
        const result: CollectionResult<CodeSourceBuildStrategy> = await this.requestCollection(cmd, CodeSourceBuildStrategy.parse);
        return result;

        return result;
    }

    public async getAllRunStrategies(workspaceId: string): Promise<CollectionResult<CodeSourceRunStrategy>> {

        let cmd: string = '/workspaces/' + workspaceId + '/codesources/runstrategies';
        const result: CollectionResult<CodeSourceRunStrategy> = await this.requestCollection(cmd, CodeSourceRunStrategy.parse);
        return result;

        return result;
    }
}
