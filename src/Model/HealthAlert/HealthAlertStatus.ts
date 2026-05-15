import {Utils} from '../../Utils.js';

export enum HealthAlertStatus {
    PASSED = 'pass',
    SKIPPED = 'skip',
    WARNING = 'warning',
    FAILED = 'fail',
}

export namespace HealthAlertStatus {

    export const fromString = (input: string): HealthAlertStatus => {
        const result: HealthAlertStatus | null = Utils.parseEnum<HealthAlertStatus>(input, HealthAlertStatus);
        if (result === null) {
            throw new Error('Unable to parse HealthAlertStatus from string: Unknown HealthAlertStatus "' + input + '"');
        }
        return result;
    }

}
