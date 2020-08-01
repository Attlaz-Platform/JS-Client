import {Utils} from '../../Utils';

export enum TriggerType {
    Schedule = 'schedule',
    Webhook = 'webhook',
    Api = 'api',

}

export namespace TriggerType {

    export function fromString(input: string): TriggerType {
        const result: TriggerType = Utils.parseEnum<TriggerType>(input, TriggerType);
        if (Utils.isNullOrUndefined(result)) {
            throw new Error('Unable to parse TriggerType from string: Unknown TriggerType "' + input + '"');
        }
        return result;
    }

}
