import {Endpoint, Trigger} from "..";

export class TriggerEndpoint extends Endpoint {

    public getTriggersByTask(taskId: string): Promise<Trigger[]> {
        return new Promise<Trigger[]>((resolve, reject) => {
            this.httpClient.request('/tasks/' + taskId + '/triggers').then((rawTriggers: any) => {

                let triggers: Trigger[] = [];
                for (let rawTrigger of rawTriggers) {
//TODO: add parsing
                    triggers.push(rawTrigger);
                }
                resolve(triggers);

            }).catch((reason) => {
                if (this.httpClient.isDebugEnabled()) {
                    console.error('Failed to load triggers: ', reason);
                }

                reject(reason);
            });

        });
    }
}