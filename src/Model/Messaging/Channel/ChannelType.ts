import {Utils} from '../../../Utils';
import {State} from '../../State';

export enum ChannelType {
    Email = 'email' as any,
    Push = 'push' as any,
    Slack = 'slack' as any,
    SMS = 'sms' as any,
    Webhook = 'webhook' as any,
}

export namespace ChannelType {
    export function fromString(input: string): ChannelType {
        const result: ChannelType = Utils.parseEnum<ChannelType>(input, State);
        if (Utils.isNullOrUndefined(result)) {
            throw new Error('Unable to parse ChannelType from string: Unknown ChannelType "' + input + '"');
        }
        return result;
    }
}
