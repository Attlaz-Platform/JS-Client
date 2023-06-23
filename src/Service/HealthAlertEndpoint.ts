import {Endpoint} from './Endpoint.js';
import {HealthAlert} from '../Model/HealthAlert/HealthAlert.js';
import {CollectionResult} from '../Model/Result/CollectionResult.js';

export class HealthAlertEndpoint extends Endpoint {
    public async getLatestByProjectEnvironment(projectEnvironmentId: string): Promise<CollectionResult<HealthAlert>> {
        try {
            const url: string = '/projectenvironments/' + projectEnvironmentId + '/health';

            const result: CollectionResult<HealthAlert> = await this.requestCollection(url, HealthAlert.parse);
            return result;
        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load health alerts: ', error);
            }

            throw error;
        }
    }
}
