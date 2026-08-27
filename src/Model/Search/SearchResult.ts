import {ApiRecord} from '../ApiRecord.js';

/**
 * One row of a search response.
 *
 * The search index is a display projection: `label` and `description` are stored in the index and
 * are everything the result list renders. Navigation is resolved on click from `entityId` and
 * `type`, so no entity is loaded for the results the user never clicks.
 *
 * `type` is deliberately a plain string rather than {@link EntityType}: an entity type this client
 * does not know about must still be shown. Parsing it into the enum here used to throw, and a
 * throw in a parser makes the row disappear from the collection with no error the user can see —
 * every multi-word type was silently missing from search for over a year that way. Map it to
 * `EntityType` where navigation is decided, and let an unrecognised type render as a result that
 * cannot be opened.
 */
export class SearchResult {
    public type: string;
    public entityId: string;
    public label: string;
    public description: string;
    public score: number;

    public static parse(rawResult: ApiRecord): SearchResult {
        const searchResult: SearchResult = new SearchResult();
        searchResult.type = rawResult.entity_type as string;
        searchResult.entityId = rawResult.entity as string;
        searchResult.label = rawResult.label as string;
        searchResult.description = rawResult.description as string;
        searchResult.score = rawResult.score as number;

        return searchResult;
    }
}
