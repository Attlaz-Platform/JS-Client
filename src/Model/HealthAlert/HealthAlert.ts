import {Utils} from '../../Utils.js';
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

    public static parse(raw: any): HealthAlert {
        const healthAlert: HealthAlert = new HealthAlert(HealthTestType.fromString(raw.health_test_type), HealthAlertStatus.fromString(raw.status));
        healthAlert.id = raw.id;
        healthAlert.scopeId = raw.scope;
        healthAlert.parentScopeId = raw.parent_scope;
        // severity defaults to ERROR — defensive for older API responses that don't yet send it.
        healthAlert.severity = raw.severity ? HealthAlertSeverity.fromString(raw.severity) : HealthAlertSeverity.ERROR;
        healthAlert.date = Utils.parseRawDate(raw.date);
        healthAlert.updated = Utils.parseRawDate(raw.updated);
        healthAlert.data = DataValueCollection.fromObject(raw.data);
        return healthAlert;
    }
}
