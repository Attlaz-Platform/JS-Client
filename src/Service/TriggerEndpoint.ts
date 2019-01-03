import {Endpoint, Trigger} from "..";

export class TriggerEndpoint extends Endpoint {

    public async getByTask(taskId: string): Promise<Trigger[]> {

        try {
            const rawTriggers: any = await this.httpClient.request('/tasks/' + taskId + '/triggers');

            let triggers: Trigger[] = [];
            for (let rawTrigger of rawTriggers) {
//TODO: add parsing
                triggers.push(rawTrigger);
            }
            return triggers;

        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load triggers: ', error);
            }
            throw error;
        }

    }

    public async getById(id: string): Promise<Trigger> {

        try {
            const rawTrigger: any = await this.httpClient.request('/triggers/' + id);

//TODO: add parsing
            return rawTrigger as Trigger;
        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load trigger by id: ', error);
            }

            throw error;
        }

    }
}
