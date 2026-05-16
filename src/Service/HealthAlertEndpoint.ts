import {QueryString} from '../Http/Data/QueryString.js';
import {EntityType} from '../Model/EntityType.js';
import {HealthAlert} from '../Model/HealthAlert/HealthAlert.js';
import {CollectionResult} from '../Model/Result/CollectionResult.js';
import {Endpoint} from './Endpoint.js';

export class HealthAlertEndpoint extends Endpoint {
    public async getCurrentAlertsByScope(scopeType: EntityType, scopeId: string): Promise<CollectionResult<HealthAlert>> {
        try {
            const q: QueryString = new QueryString('/health/' + scopeType + '/' + scopeId);

            const result: CollectionResult<HealthAlert> = await this.requestCollection(q, HealthAlert.parse);
            return result;
        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load health alerts: ', error);
            }

            throw error;
        }
    }

    /**
     * Fetch all current alerts under a parent scope (today: only ProjectEnvironment).
     * One query returns env-direct, pool-direct, and flow-direct alerts in a single round-trip
     * — replaces the old N-call multi-scope loop on env-overview pages.
     */
    public async getCurrentAlertsByParentScope(parentScopeType: EntityType, parentScopeId: string): Promise<CollectionResult<HealthAlert>> {
        try {
            const q: QueryString = new QueryString('/health/by-parent/' + parentScopeType + '/' + parentScopeId);

            const result: CollectionResult<HealthAlert> = await this.requestCollection(q, HealthAlert.parse);
            return result;
        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load health alerts by parent scope: ', error);
            }

            throw error;
        }
    }
}
