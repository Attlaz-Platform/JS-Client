import {CatalogId} from '../../Catalog/Model/CatalogId.js';
import {QueryString} from '../../Http/Data/QueryString.js';
import {CursorPagination} from '../../Model/Pagination/CursorPagination.js';
import {CollectionResult} from '../../Model/Result/CollectionResult.js';
import {ObjectResult} from '../../Model/Result/ObjectResult.js';
import {Endpoint} from '../../Service/Endpoint.js';
import {PriceAlertConfig} from '../Model/PriceAlertConfig.js';
import {PriceAlertConfigData} from '../Model/PriceAlertConfigData.js';
import {PriceAlertEvent} from '../Model/PriceAlertEvent.js';

/**
 * Price alerts — the standing rules (`/pulse/price-alert-configs`) and the events they produce.
 */
export class PriceAlertEndpoint extends Endpoint {

    public async getConfigs(catalogId: CatalogId | string, pagination: CursorPagination | null = null): Promise<CollectionResult<PriceAlertConfig>> {
        const queryString: QueryString = new QueryString('/pulse/catalogs/' + catalogId.toString() + '/price-alert-configs');
        queryString.addPagination(pagination);

        return await this.requestCollection(queryString, PriceAlertConfig.parse);
    }

    public async getConfig(alertConfigId: string): Promise<PriceAlertConfig | null> {
        const result: ObjectResult<PriceAlertConfig> = await this.requestObject(
            '/pulse/price-alert-configs/' + alertConfigId,
            null,
            PriceAlertConfig.parse,
            'GET',
        );

        return result.getData();
    }

    public async createConfig(catalogId: CatalogId | string, data: PriceAlertConfigData): Promise<PriceAlertConfig | null> {
        const result: ObjectResult<PriceAlertConfig> = await this.requestObject(
            '/pulse/catalogs/' + catalogId.toString() + '/price-alert-configs',
            data,
            PriceAlertConfig.parse,
            'POST',
        );

        return result.getData();
    }

    public async updateConfig(alertConfigId: string, data: Partial<PriceAlertConfigData>): Promise<PriceAlertConfig | null> {
        const result: ObjectResult<PriceAlertConfig> = await this.requestObject(
            '/pulse/price-alert-configs/' + alertConfigId,
            data,
            PriceAlertConfig.parse,
            'PATCH',
        );

        return result.getData();
    }

    public async deleteConfig(alertConfigId: string): Promise<void> {
        await this.requestObject(
            '/pulse/price-alert-configs/' + alertConfigId,
            null,
            (raw: unknown): unknown => raw,
            'DELETE',
        );
    }

    public async getEvents(alertConfigId: string, pagination: CursorPagination | null = null): Promise<CollectionResult<PriceAlertEvent>> {
        const queryString: QueryString = new QueryString('/pulse/price-alert-configs/' + alertConfigId + '/events');
        queryString.addPagination(pagination);

        return await this.requestCollection(queryString, PriceAlertEvent.parse);
    }

    /**
     * Record that someone has dealt with an event; it stays in the list. The API stamps who and
     * when from the session, so the request carries no body.
     */
    public async acknowledgeEvent(alertEventId: string): Promise<PriceAlertEvent | null> {
        const result: ObjectResult<PriceAlertEvent> = await this.requestObject(
            '/pulse/price-alert-events/' + alertEventId,
            {},
            PriceAlertEvent.parse,
            'PATCH',
        );

        return result.getData();
    }
}
