import {Utils} from '../../../Utils';

export enum ChannelType {
    Email = 'email' as any,
    Push = 'push' as any,
    Slack = 'slack' as any,
    SMS = 'sms' as any,
    Webhook = 'webhook' as any,
}

export namespace ChannelType {

    export function fromString(channelType: string): ChannelType {
        let result: ChannelType;
        if (Utils.isNullOrUndefined(channelType)) {
            throw new Error('Unable to parse ChannelType from string: channelType not defined');
        }
        switch (channelType.toLowerCase()) {
            case 'email':
                result = ChannelType.Email;
                break;
            case 'push':
                result = ChannelType.Push;
                break;
            case 'slack':
                result = ChannelType.Slack;
                break;
            case 'sms':
                result = ChannelType.SMS;
                break;
            case 'webhook':
                result = ChannelType.Webhook;
                break;

            default:
                throw new Error('Unknown channelType "' + channelType + '"');
        }

        return result;
    }

}
