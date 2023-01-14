import {Endpoint} from './Endpoint';
import {Trigger} from '../Model/Trigger/Trigger';
import {Utils} from '../Utils';
import {CollectionResult} from '../Model/Result/CollectionResult';
import {ObjectResult} from '../Model/Result/ObjectResult';

export class TriggerEndpoint extends Endpoint {

    public async getByFlow(flowId: string, projectEnvironmentId: string | null = null): Promise<CollectionResult<Trigger>> {

        try {
            let parameters: any = null;
            if (!Utils.isNullOrUndefined(projectEnvironmentId)) {
                parameters = {environment: projectEnvironmentId};
            }

            const rawTriggers: CollectionResult<Trigger> = await this.requestCollection('/flows/' + flowId + '/triggers', parameters, Trigger.parse);

            return rawTriggers;

        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load triggers: ', error);
            }
            throw error;
        }

    }

    public async getById(id: string): Promise<Trigger | null> {

        try {
            const result: ObjectResult<Trigger> = await this.requestObject('/triggers/' + id, null, Trigger.parse);
            return result.getData();

        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load trigger by id: ', error);
            }

            throw error;
        }

    }

    public async save(trigger: Trigger): Promise<Trigger> {

        try {

            let url: string = '/flows/' + trigger.flowId + '/triggers';

            const result: any = await this.requestObject(url, trigger, Trigger.parse, 'POST');

            const createdTrigger: Trigger | null = result.getData();
            if (createdTrigger === null) {
                throw new Error('Trigger not created');
            }
            return createdTrigger;
        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to save trigger: ', error);
            }

            throw error;
        }

    }
}
