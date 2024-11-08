import {Endpoint} from './Endpoint.js';
import {ObjectResult} from '../Model/Result/ObjectResult.js';
import {Utils} from '../Utils.js';
import {CollectionResult} from '../Model/Result/CollectionResult.js';
import {QueryString} from '../Http/Data/QueryString.js';
import {CursorPagination} from '../Model/Pagination/CursorPagination.js';

export type BlockedIp = { id: string; ip: string; from: Date; to: Date; reason: string };
export type FlaggedIp = { id: string; ip: string; date: Date; reason: string };
export type IpRule = { id: string; ip: string; action: string; description: string };

export class FirewallEndpoint extends Endpoint {
    public async getBlockedIps(pagination: CursorPagination): Promise<CollectionResult<BlockedIp>> {
        const parser = (raw: any): BlockedIp => {

            return {
                id: raw.id,
                ip: raw.ip,
                from: Utils.parseRawDate(raw.from),
                to: Utils.parseRawDate(raw.to),
                reason: raw.reason,
            } as BlockedIp;

        };

        const queryString: QueryString = new QueryString('/system/firewall/blocked');
        queryString.addPagination(pagination);
        const result: CollectionResult<BlockedIp> = await this.requestCollection(queryString, parser);
        return result;
    }

    public async getFlaggedIps(pagination: CursorPagination): Promise<CollectionResult<FlaggedIp>> {
        const parser = (raw: any): FlaggedIp => {

            return {
                id: raw.id,
                ip: raw.ip,
                date: Utils.parseRawDate(raw.date),
                reason: raw.reason,
            } as FlaggedIp;

        };

        const queryString: QueryString = new QueryString('/system/firewall/flagged');
        queryString.addPagination(pagination);
        const result: CollectionResult<FlaggedIp> = await this.requestCollection(queryString, parser);
        return result;
    }

    public async getIpRules(pagination: CursorPagination): Promise<CollectionResult<IpRule>> {
        const parser = (raw: any): IpRule => {

            return {
                id: raw.id,
                ip: raw.ip,
                action: raw.action,
                description: raw.description,
            } as IpRule;

        };

        const queryString: QueryString = new QueryString('/system/firewall/rules');
        queryString.addPagination(pagination);
        const result: CollectionResult<IpRule> = await this.requestCollection(queryString, parser);
        return result;
    }

    public async createIpRule(ip: string, action: string, description: string = ''): Promise<boolean> {
        const cmd: string = '/system/firewall/ip_rules';

        try {
            const parser = (raw: any): { success: boolean } => raw.success;
            const result: ObjectResult<{ success: boolean }> = await this.requestObject(cmd, {
                ip, action, description,
            }, parser, 'PUT');

            const re: { success: boolean } | null = result.getData();
            if (re === null) {
                console.log('createIPRule wrong result', {result, parsed: re});
                throw new Error('Unable to create IP rule: wrong response from API');
            }
            return re.success;
        } catch (ex) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to create IP rule', ex);
            }

            throw ex;
        }
    }

    public async unblockIP(ip: string): Promise<boolean> {
        const cmd: string = '/system/firewall/blocked_ips';

        try {
            const parser = (raw: any): { success: boolean } => ({success: raw.success});
            const result: ObjectResult<{ success: boolean }> = await this.requestObject(cmd, {ip}, parser, 'DELETE');
            const x: { success: boolean } | null = result.getData();
            if (x === null) {
                console.log('Unblock ip wrong response', {result, parsed: x});
                throw new Error('Unable to unblock ip: wrong response from API');
            }
            return x.success;
        } catch (ex) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Unable to unblock ip', ex);
            }

            throw ex;
        }
    }
}
