import {Utils} from '../..';

export enum HealthAlertStatus {
    PASSED = 'pass',
    SKIPPED = 'skip',
    FAILED = 'fail',
}

export namespace HealthAlertStatus {

    export function fromString(input: string): HealthAlertStatus {
        const result: HealthAlertStatus = Utils.parseEnum<HealthAlertStatus>(input, HealthAlertStatus);
        if (Utils.isNullOrUndefined(result)) {
            throw new Error('Unable to parse HealthAlertStatus from string: Unknown HealthAlertStatus "' + input + '"');
        }
        return result;
    }

}
