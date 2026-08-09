import {QueryString} from '../Http/Data/QueryString.js';
import {CollectionResult} from '../Model/Result/CollectionResult.js';
import {Timezone} from '../Model/Timezone.js';
import {Endpoint} from './Endpoint.js';

export class TimezoneEndpoint extends Endpoint {
    /**
     * Every timezone a schedule or a user profile can be set to.
     *
     * Deliberately not paginated: this is a fixed reference list of a few hundred entries owned by
     * the platform's runtime, not a growing collection, and a picker needs all of it to filter
     * against.
     */
    public async getAll(): Promise<CollectionResult<Timezone>> {
        return await this.requestCollection(new QueryString('/timezones'), Timezone.parse);
    }
}
