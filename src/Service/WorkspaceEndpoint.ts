import {Endpoint} from './Endpoint';
import {Workspace} from '../Model/Workspace/Workspace';
import {CollectionResult} from '../Model/Result/CollectionResult';

export class WorkspaceEndpoint extends Endpoint {

    public async getAll(): Promise<CollectionResult<Workspace>> {
        try {
            const result: CollectionResult<Workspace> = await this.requestCollection('/workspaces',  Workspace.parse);

            return result;
        } catch (e) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load workspaces: ' + e);
            }

            throw e;
        }

    }

}
