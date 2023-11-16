import {Endpoint} from './Endpoint.js';
import {Workspace} from '../Model/Workspace/Workspace.js';
import {CollectionResult} from '../Model/Result/CollectionResult.js';
import {ObjectResult} from '../Model/Result/ObjectResult';

export class WorkspaceEndpoint extends Endpoint {
    public async getAll(): Promise<CollectionResult<Workspace>> {
        try {
            const result: CollectionResult<Workspace> = await this.requestCollection('/workspaces', Workspace.parse);

            return result;
        } catch (e) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load workspaces: ' + e);
            }

            throw e;
        }
    }

    public async save(workspace: Workspace): Promise<Workspace> {
        try {
            const url: string = '/workspace';
            const result: ObjectResult<Workspace> = await this.requestObject(url, workspace, Workspace.parse, 'POST');
            const updatedWorkspace: Workspace | null = result.getData();
            if (updatedWorkspace === null) {
                throw new Error('Workspace not updated');
            }
            return updatedWorkspace;
        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to save workspace: ', error);
            }
            throw error;
        }
    }
}
