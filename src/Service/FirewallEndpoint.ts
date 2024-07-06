import {Endpoint} from './Endpoint.js';
import {ObjectResult} from '../Model/Result/ObjectResult.js';
import {Utils} from '../Utils.js';

export type BlockedIp = { ip: string; from: Date; to: Date; reason: string };
export type FlaggedIp = { ip: string; date: Date; reason: string };
export type IpRule = { ip: string; action: string; description: string };
export type FirewallInfo = { blockedIps: BlockedIp[], flaggedIps: FlaggedIp[], ipRules: IpRule[] };

export class FirewallEndpoint extends Endpoint {
    public async getInformation(): Promise<FirewallInfo | null> {
        const cmd: string = '/system/firewall/';

        try {
            const parser = (raw: any): FirewallInfo => {
                const info: FirewallInfo = {
                    blockedIps: [],
                    flaggedIps: [],
                    ipRules: [],
                };
                for (const blockedIp of raw.blocked_ips) {
                    blockedIp.from = Utils.parseRawDate(blockedIp.from);
                    blockedIp.to = Utils.parseRawDate(blockedIp.to);
                    info.blockedIps.push(blockedIp);
                }
                for (const flaggedIp of raw.flagged_ips) {
                    flaggedIp.date = Utils.parseRawDate(flaggedIp.date);
                    info.flaggedIps.push(flaggedIp);
                }
                for (const ipRule of raw.ip_rules) {
                    info.ipRules.push(ipRule);
                }
                return info;
            };
            const result: ObjectResult<FirewallInfo> = await this.requestObject(cmd, null, parser, 'GET');

            return result.getData();
        } catch (ex) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to get firewall information', ex);
            }

            throw ex;
        }
    }

    public async createIpRule(ip: string, action: string, description: string = ''): Promise<boolean> {
        const cmd: string = '/system/firewall/ip_rules';

        try {
            const parser = (raw: any): { success: boolean } => raw.success;
            const result: ObjectResult<{ success: boolean }> = await this.requestObject(cmd, {ip, action, description}, parser, 'PUT');

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
