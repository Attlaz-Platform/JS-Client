import {HealthTestType} from './HealthTestType';
import {HealthAlertStatus} from './HealthAlertStatus';

export class HealthAlert {
    public healthTestType: HealthTestType;
    public status: HealthAlertStatus;
    public date: Date;
    public data: { key: string, value: string | number }[] = [];

    public constructor(healthTestType: HealthTestType, status: HealthAlertStatus) {
        this.healthTestType = healthTestType;
        this.status = status;
        this.date = new Date();
        this.data = [];
    }

    public static parse(raw: any): HealthAlert {
        let log: HealthAlert = new HealthAlert(HealthTestType.fromString(raw.healthTestType), HealthAlertStatus.fromString(raw.status));
        log.date = new Date(raw.date);
        log.data = raw.data;
        return log;
    }

    public getDataValue(key: string): string | number | null {
        for (const tag of this.data) {
            if (tag.key === key) {
                return tag.value;
            }
        }
        return null;
    }
}
