import {Endpoint, Trigger, Utils} from '..';

export class TriggerEndpoint extends Endpoint {

    public async getByTask(taskId: string, projectEnvironmentId: string = null): Promise<Trigger[]> {

        try {
            let parameters: any = null;
            if (!Utils.isNullOrUndefined(projectEnvironmentId)) {
                parameters = {environment: projectEnvironmentId};
            }

            const rawTriggers: any[] = await this.httpClient.request('/tasks/' + taskId + '/triggers', parameters);

            let triggers: Trigger[] = [];
            for (let rawTrigger of rawTriggers) {

                triggers.push(Trigger.parse(rawTrigger));
            }
            return triggers;

        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load triggers: ', error);
            }
            throw error;
        }

    }

    public async getById(id: string): Promise<Trigger | null> {

        try {
            const result: any = await this.httpClient.request('/triggers/' + id);
            if (Utils.isNullOrUndefined(result)) {
                return null;
            }
            return Trigger.parse(result);

        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load trigger by id: ', error);
            }

            throw error;
        }

    }

    public async save(trigger: Trigger): Promise<Trigger> {

        try {

            let url: string = '/tasks/' + trigger.task + '/triggers';

            const result: any = await this.httpClient.request(url, trigger, 'POST');

            return Trigger.parse(result);
        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to save trigger: ', error);
            }

            throw error;
        }

    }
}
