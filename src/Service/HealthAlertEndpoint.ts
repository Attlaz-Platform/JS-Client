import {Endpoint} from './Endpoint.js';
import {HealthAlert} from '../Model/HealthAlert/HealthAlert.js';
import {CollectionResult} from '../Model/Result/CollectionResult.js';
import {EntityType} from '../Model/EntityType.js';
import {QueryString} from '../Http/Data/QueryString.js';

export class HealthAlertEndpoint extends Endpoint {
    public async getLatestByScope(scopeType: EntityType, scopeId: string, parentScopeId: string | null): Promise<CollectionResult<HealthAlert>> {
        try {
            const q: QueryString = new QueryString('/health/' + scopeType + '/' + scopeId + '');
            if (parentScopeId !== null) {
                q.set('parentScopeId', parentScopeId)
            }


            const result: CollectionResult<HealthAlert> = await this.requestCollection(q, HealthAlert.parse);
            return result;
        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load health alerts: ', error);
            }

            throw error;
        }
    }
}
