import {Utils} from '../../Utils';

export enum TriggerType {
    Schedule = 'schedule',
    Webhook = 'webhook',
    Api = 'api',
}

export namespace TriggerType {
    export function fromString(input: string): TriggerType {
        const result: TriggerType|null = Utils.parseEnum<TriggerType>(input, TriggerType);
        if (result === null) {
            throw new Error('Unable to parse TriggerType from string: Unknown TriggerType "' + input + '"');
        }
        return result;
    }
}
