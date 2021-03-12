import {DataResult, Endpoint, HealthAlert, Utils} from '..';

export class HealthAlertEndpoint extends Endpoint {

    public async getLatestByProjectEnvironment(projectEnvironmentId: string): Promise<HealthAlert[]> {

        try {
            let url: string = '/projectenvironments/' + projectEnvironmentId + '/health';

            const result: DataResult<HealthAlert[]> = await this.request(url);
            if (Utils.isNullOrUndefined(result)) {
                return null;
            }
            let alerts: HealthAlert[] = [];
            for (let raw of result.getData()) {

                alerts.push(HealthAlert.parse(raw));
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
