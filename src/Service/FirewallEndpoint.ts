import {Endpoint} from './Endpoint.js';
import {ObjectResult} from '../Model/Result/ObjectResult.js';

export class FirewallEndpoint extends Endpoint {
    public async getInformation(): Promise<{ blocked_ips: any[], flagged_ips: any[], ip_rules: [] } | null> {
        const cmd: string = '/system/firewall/';

        try {
            const parser = (raw: any): { blocked_ips: any[], flagged_ips: any[], ip_rules: [] } => {
                const info: { blocked_ips: any[], flagged_ips: any[], ip_rules: [] } = {
                    blocked_ips: raw.blocked_ips,
                    flagged_ips: raw.flagged_ips,
                    ip_rules: raw.ip_rules,
                };

                return info;
            };
            const result: ObjectResult<{ blocked_ips: any[], flagged_ips: any[], ip_rules: [] }> = await this.requestObject(cmd, null, parser, 'GET');

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
