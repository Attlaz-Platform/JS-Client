import {Utils} from '../../Utils.js';
import {ApiRecord} from '../ApiRecord.js';
import {DataValueValue} from '../DataValue.js';
import {DataValueCollection} from '../DataValueCollection.js';
import {HealthAlertSeverity} from './HealthAlertSeverity.js';
import {HealthAlertStatus} from './HealthAlertStatus.js';
import {HealthTestType} from './HealthTestType.js';

export class HealthAlert {
    public id: string;
    public scopeId: string;
    public parentScopeId: string | null;

    public healthTestType: HealthTestType;
    public status: HealthAlertStatus;
    public severity: HealthAlertSeverity = HealthAlertSeverity.ERROR;
    public date: Date;
    public updated: Date;

    public data: DataValueCollection;

    public constructor(healthTestType: HealthTestType, status: HealthAlertStatus) {
        this.healthTestType = healthTestType;
        this.status = status;
        this.date = new Date();
        this.data = new DataValueCollection();
    }

    public static parse(raw: ApiRecord): HealthAlert {
        const healthAlert: HealthAlert = new HealthAlert(HealthTestType.fromString(raw.health_test_type as string), HealthAlertStatus.fromString(raw.status as string));
        healthAlert.id = raw.id as string;
        healthAlert.scopeId = raw.scope as string;
        healthAlert.parentScopeId = raw.parent_scope as string | null;
        // severity defaults to ERROR — defensive for older API responses that don't yet send it.
        healthAlert.severity = raw.severity ? HealthAlertSeverity.fromString(raw.severity as string) : HealthAlertSeverity.ERROR;
        healthAlert.date = Utils.parseRawDate(raw.date as Date);
        healthAlert.updated = Utils.parseRawDate(raw.updated as Date);
        healthAlert.data = DataValueCollection.fromObject(raw.data as { key: string, value: DataValueValue }[] | null);
        return healthAlert;
    }
}
