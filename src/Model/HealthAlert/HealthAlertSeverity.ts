import {Utils} from '../../Utils.js';

export enum HealthAlertSeverity {
    INFO = 'info',
    WARNING = 'warning',
    ERROR = 'error',
}

export namespace HealthAlertSeverity {

    export const fromString = (input: string): HealthAlertSeverity => {
        const result: HealthAlertSeverity | null = Utils.parseEnum<HealthAlertSeverity>(input, HealthAlertSeverity);
        if (result === null) {
            throw new Error('Unable to parse HealthAlertSeverity from string: Unknown HealthAlertSeverity "' + input + '"');
        }
        return result;
    }

}
