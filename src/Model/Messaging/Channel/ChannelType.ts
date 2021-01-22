import {Utils} from '../../../Utils';

export enum ChannelType {
    Email = 'email',
    Push = 'push',
    Slack = 'slack',
    SMS = 'sms',
    Webhook = 'webhook',
}

export namespace ChannelType {
    export function fromString(input: string): ChannelType {
        const result: ChannelType = Utils.parseEnum<ChannelType>(input, ChannelType);
        if (Utils.isNullOrUndefined(result)) {
            throw new Error('Unable to parse ChannelType from string: Unknown ChannelType "' + input + '"');
        }
        return result;
    }
}
