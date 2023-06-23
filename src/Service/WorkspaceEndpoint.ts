import {Endpoint} from './Endpoint.js';
import {Workspace} from '../Model/Workspace/Workspace.js';
import {CollectionResult} from '../Model/Result/CollectionResult.js';

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
