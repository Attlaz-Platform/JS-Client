import {Endpoint} from './Endpoint';
import {HealthAlert} from '../Model/HealthAlert/HealthAlert';
import {DataResult} from '../Model/Result/DataResult';

export class HealthAlertEndpoint extends Endpoint {

    public async getLatestByProjectEnvironment(projectEnvironmentId: string): Promise<HealthAlert[]> {

        try {
            let url: string = '/projectenvironments/' + projectEnvironmentId + '/health';

            const result: DataResult<HealthAlert[]> = await this.request(url);
            // if (Utils.isNullOrUndefined(result)) {
            //     return null;
            // }
            let alerts: HealthAlert[] = [];

            const resultData: any | null = result.getData();
            if (resultData !== null) {
                for (let raw of resultData) {
                    alerts.push(HealthAlert.parse(raw));
                }
            }

            return alerts;

        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load health alerts: ', error);
            }

            throw error;
        }

    }

}
