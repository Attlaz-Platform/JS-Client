import {Endpoint} from './Endpoint';
import {Team} from '../Model/Team/Team';

import {DataResult} from '../Model/Result/DataResult';

export class TeamsEndpoint extends Endpoint {

    public async getAll(): Promise<Team[]> {
        try {
            const result: DataResult<Team[]> = await this.request('/teams');
            result.setData(this.parseCollection(result, Team.parse));
            return result.getData();
        } catch (e) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load teams: ' + e);
            }

            throw e;
        }

    }

}
