import {path} from '../../Http/Data/Path.js';
import {ObjectResult} from '../../Model/Result/ObjectResult.js';
import {Endpoint} from '../../Service/Endpoint.js';
import {Vendor} from '../Model/Vendor.js';

/**
 * Vendors — the shops Market Pulse knows about, independent of who watches them.
 *
 * Creating a vendor and watching it as a competitor are separate steps: create here, then link it
 * to a catalog with {@link CompetitorEndpoint.add}. That split is what lets one vendor be watched
 * by several catalogs without being duplicated.
 *
 * There is deliberately no "list vendors" method: vendors are global, so listing them would expose
 * every customer's tracked shops. Discovery gets designed alongside the UI that needs it.
 */
export class VendorEndpoint extends Endpoint {

    public async getById(vendorId: string): Promise<Vendor | null> {
        const result: ObjectResult<Vendor> = await this.requestObject(
            path('/pulse/vendors/:vendorId', {vendorId}),
            null,
            Vendor.parse,
            'GET',
        );

        return result.getData();
    }

    /**
     * Register a shop.
     *
     * `url` is normalised server-side (scheme added, trailing slash dropped, host lowercased), and a
     * storefront that already has a vendor is rejected — so this is safe to call without checking
     * first, but it will throw rather than return the existing vendor.
     *
     * @param url Storefront root. A locale path is significant: `https://shop.com/nl` is a
     *        different storefront from `https://shop.com`.
     */
    public async create(name: string, url: string, currency: string | null = null, type: string | null = null): Promise<Vendor | null> {
        const result: ObjectResult<Vendor> = await this.requestObject(
            '/pulse/vendors',
            {name, url, currency, type},
            Vendor.parse,
            'POST',
        );

        return result.getData();
    }
}
