import {HealthTestType} from './HealthTestType';
import {HealthAlertStatus} from './HealthAlertStatus';
import {DataValue, DataValueValue} from '../DataValue';

export class HealthAlert {
    public id: number;
    public healthTestType: HealthTestType;
    public status: HealthAlertStatus;
    public date: Date;
    public data: DataValue[] = [];

    public constructor(healthTestType: HealthTestType, status: HealthAlertStatus) {
        this.healthTestType = healthTestType;
        this.status = status;
        this.date = new Date();
        this.data = [];
    }

    public static parse(raw: any): HealthAlert {
        let healthAlert: HealthAlert = new HealthAlert(HealthTestType.fromString(raw.health_test_type), HealthAlertStatus.fromString(raw.status));
        healthAlert.id = raw.id;
        healthAlert.date = new Date(raw.date);
        healthAlert.data = raw.data;
        return healthAlert;
    }

    public getDataValue(key: string): DataValueValue | null {
        for (const tag of this.data) {
            if (tag.key === key) {
                return tag.value;
            }
        }
        return null;
    }
}
