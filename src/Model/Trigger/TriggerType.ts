export enum TriggerType {
    Schedule = 'schedule',
    Webhook = 'webhook',
    Api = 'api',

}

export namespace TriggerType {

    export function fromString(triggerType: string): TriggerType {

        let result: TriggerType;
        if (triggerType === null || triggerType == undefined) {
            throw new Error('Unable to parse TriggerType from string: TriggerType not defined');
        }
        switch (triggerType.toLowerCase()) {
            case 'schedule':
                result = TriggerType.Schedule;
                break;
            case 'webhook':
                result = TriggerType.Webhook;
                break;
            case 'api':
                result = TriggerType.Api;
                break;

            default:
                throw new Error('Unknown log TriggerType "' + triggerType + '"');
        }

        return result;
    }

}
