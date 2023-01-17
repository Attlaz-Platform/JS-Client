import {Endpoint} from './Endpoint';
import {HealthAlert} from '../Model/HealthAlert/HealthAlert';
import {CollectionResult} from '../Model/Result/CollectionResult';

export class HealthAlertEndpoint extends Endpoint {

    public async getLatestByProjectEnvironment(projectEnvironmentId: string): Promise<CollectionResult<HealthAlert>> {

        try {
            let url: string = '/projectenvironments/' + projectEnvironmentId + '/health';

            const result: CollectionResult<HealthAlert> = await this.requestCollection(url, null, HealthAlert.parse);
            return result;

        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load health alerts: ', error);
            }

            throw error;
        }

    }

}
