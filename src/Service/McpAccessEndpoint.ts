import {path} from '../Http/Data/Path.js';
import {QueryString} from '../Http/Data/QueryString.js';
import {McpAccess} from '../Model/Mcp/McpAccess.js';
import {CollectionResult} from '../Model/Result/CollectionResult.js';
import {ObjectResult} from '../Model/Result/ObjectResult.js';
import {Endpoint} from './Endpoint.js';

export class McpAccessEndpoint extends Endpoint {

    /**
     * Every access pointing at one connection or bundle, revoked ones included — a revoked access is
     * what explains to its owner why a URL they handed out stopped working.
     *
     * `target` is the type-prefixed id (`adc_…`, `cbl_…`), the same form the access reports back.
     */
    public async getAccessesByTarget(target: string): Promise<CollectionResult<McpAccess>> {
        try {
            const queryString: QueryString = new QueryString('/mcp-accesses');
            queryString.set('target', target);

            return await this.requestCollection(queryString, McpAccess.parse);
        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load MCP accesses: ', error);
            }
            throw error;
        }
    }

    public async getAccessById(accessId: string): Promise<McpAccess | null> {
        try {
            const url: string = path('/mcp-accesses/:accessId', {accessId});

            const result: ObjectResult<McpAccess> = await this.requestObject(url, null, McpAccess.parse);

            return result.getData();
        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load MCP access: ', error);
            }
            throw error;
        }
    }

    /** Creates the access and its first URL together — an access with no URL cannot be reached. */
    public async createAccess(name: string, target: string): Promise<McpAccess> {
        try {
            const result: ObjectResult<McpAccess> = await this.requestObject('/mcp-accesses', {name, target}, McpAccess.parse, 'POST');

            const created: McpAccess | null = result.getData();
            if (created === null) {
                throw new Error('MCP access not created');
            }
            return created;
        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to create MCP access: ', error);
            }
            throw error;
        }
    }

    /** New URL, old one dead, and every token bound to the old one revoked. */
    public async rotateKey(accessId: string): Promise<McpAccess> {
        return await this.lifecycle(accessId, path('/mcp-accesses/:accessId/rotate-key', {accessId}), 'POST', 'rotate the MCP URL');
    }

    /** Reversible, and keeps its tokens, so resuming needs no re-authentication. */
    public async pauseAccess(accessId: string): Promise<McpAccess> {
        return await this.lifecycle(accessId, path('/mcp-accesses/:accessId/pause', {accessId}), 'POST', 'pause the MCP access');
    }

    public async resumeAccess(accessId: string): Promise<McpAccess> {
        return await this.lifecycle(accessId, path('/mcp-accesses/:accessId/resume', {accessId}), 'POST', 'resume the MCP access');
    }

    /** One-way. The row survives as the record of what was granted; its tokens do not. */
    public async revokeAccess(accessId: string): Promise<McpAccess> {
        return await this.lifecycle(accessId, path('/mcp-accesses/:accessId', {accessId}), 'DELETE', 'revoke the MCP access');
    }

    private async lifecycle(accessId: string, url: string, method: string, description: string): Promise<McpAccess> {
        try {
            const result: ObjectResult<McpAccess> = await this.requestObject(url, null, McpAccess.parse, method);

            const access: McpAccess | null = result.getData();
            if (access === null) {
                throw new Error('MCP access not found: ' + accessId);
            }
            return access;
        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to ' + description + ': ', error);
            }
            throw error;
        }
    }
}
