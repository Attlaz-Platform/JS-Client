import {Endpoint, Trigger} from "..";

export class TriggerEndpoint extends Endpoint {

    public getTriggersByTask(taskId: string): Promise<Trigger[]> {
        return new Promise<Trigger[]>((resolve, reject) => {
            this.httpClient.request('/branch/' + this.httpClient.getBranchId() + '/task/' + taskId + '/trigger').then((rawTriggers: any) => {

                let triggers: Trigger[] = [];
                for (let rawTrigger of rawTriggers) {
//TODO: add parsing
                    triggers.push(rawTrigger);
                }
                resolve(triggers);

            }).catch((reason) => {
                console.log('Failed to load triggers: ', reason);
                reject(reason);
            });

        });
    }
}