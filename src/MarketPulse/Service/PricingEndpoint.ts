import {CatalogId} from '../../Catalog/Model/CatalogId.js';
import {QueryString} from '../../Http/Data/QueryString.js';
import {CursorPagination} from '../../Model/Pagination/CursorPagination.js';
import {CollectionResult} from '../../Model/Result/CollectionResult.js';
import {ObjectResult} from '../../Model/Result/ObjectResult.js';
import {Endpoint} from '../../Service/Endpoint.js';
import {PriceSuggestion, PriceSuggestionStatus} from '../Model/PriceSuggestion.js';
import {PricingRule} from '../Model/PricingRule.js';
import {PricingRuleData} from '../Model/PricingRuleData.js';

/**
 * Repricing — the rules that propose prices (`/pulse/pricing-rules`) and the suggestions they
 * produce (`/pulse/price-suggestions`).
 */
export class PricingEndpoint extends Endpoint {

    public async getRules(catalogId: CatalogId | string, pagination: CursorPagination | null = null): Promise<CollectionResult<PricingRule>> {
        const queryString: QueryString = new QueryString('/pulse/catalogs/' + catalogId.toString() + '/pricing-rules');
        queryString.addPagination(pagination);

        return await this.requestCollection(queryString, PricingRule.parse);
    }

    public async getRule(pricingRuleId: string): Promise<PricingRule | null> {
        const result: ObjectResult<PricingRule> = await this.requestObject(
            '/pulse/pricing-rules/' + pricingRuleId,
            null,
            PricingRule.parse,
            'GET',
        );

        return result.getData();
    }

    public async createRule(catalogId: CatalogId | string, data: PricingRuleData): Promise<PricingRule | null> {
        const result: ObjectResult<PricingRule> = await this.requestObject(
            '/pulse/catalogs/' + catalogId.toString() + '/pricing-rules',
            data,
            PricingRule.parse,
            'POST',
        );

        return result.getData();
    }

    public async updateRule(pricingRuleId: string, data: Partial<PricingRuleData>): Promise<PricingRule | null> {
        const result: ObjectResult<PricingRule> = await this.requestObject(
            '/pulse/pricing-rules/' + pricingRuleId,
            data,
            PricingRule.parse,
            'PATCH',
        );

        return result.getData();
    }

    public async deleteRule(pricingRuleId: string): Promise<void> {
        await this.requestObject(
            '/pulse/pricing-rules/' + pricingRuleId,
            null,
            (raw: unknown): unknown => raw,
            'DELETE',
        );
    }

    /** Price suggestions of a catalog, optionally only those in one status. */
    public async getSuggestions(catalogId: CatalogId | string, pagination: CursorPagination | null = null, status: string | null = null): Promise<CollectionResult<PriceSuggestion>> {
        const queryString: QueryString = new QueryString('/pulse/catalogs/' + catalogId.toString() + '/price-suggestions');
        if (status !== null) {
            queryString.set('status', status);
        }
        queryString.addPagination(pagination);

        return await this.requestCollection(queryString, PriceSuggestion.parse);
    }

    public async getSuggestion(priceSuggestionId: string): Promise<PriceSuggestion | null> {
        const result: ObjectResult<PriceSuggestion> = await this.requestObject(
            '/pulse/price-suggestions/' + priceSuggestionId,
            null,
            PriceSuggestion.parse,
            'GET',
        );

        return result.getData();
    }

    /**
     * Approve or reject a suggestion. Approving marks it for pushing back to the shop; the write
     * itself is done by a flow, which sets `appliedAt`.
     */
    public async reviewSuggestion(priceSuggestionId: string, status: Exclude<PriceSuggestionStatus, 'pending'>): Promise<PriceSuggestion | null> {
        const result: ObjectResult<PriceSuggestion> = await this.requestObject(
            '/pulse/price-suggestions/' + priceSuggestionId,
            {status},
            PriceSuggestion.parse,
            'PATCH',
        );

        return result.getData();
    }
}
