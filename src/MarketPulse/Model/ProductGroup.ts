import {ApiRecord} from '../../Model/ApiRecord.js';

/** `dynamic` groups are evaluated from {@link ProductGroup.criteria}; `manual` ones hold a fixed list. */
export type ProductGroupType = 'dynamic' | 'manual';

/**
 * A named subset of a catalog's products — the `/pulse/product-groups` resource. Pricing rules and
 * price alerts are scoped to one, and the product list can be filtered by it.
 *
 * `criteria` is the raw rule object of a dynamic group (`{"brand": "Philips"}`,
 * `{"sales_volume": {">": 100}}`); its shape is open, so it is passed through untouched.
 */
export class ProductGroup {
    public id: string;
    public catalogId: string;
    public name: string;
    public description: string | null = null;
    public groupType: ProductGroupType = 'dynamic';
    public criteria: Record<string, unknown> = {};
    /** Created from a built-in template rather than by hand. */
    public isTemplate: boolean = false;
    public templateKey: string | null = null;
    public createdAt: Date | null = null;
    public updatedAt: Date | null = null;

    public constructor(id: string, catalogId: string, name: string) {
        this.id = id;
        this.catalogId = catalogId;
        this.name = name;
    }

    public static parse(raw: ApiRecord): ProductGroup {
        const group: ProductGroup = new ProductGroup(
            raw.id as string,
            raw.catalog as string,
            (raw.name as string | undefined) ?? '',
        );
        group.description = (raw.description as string | undefined) ?? null;
        group.groupType = (raw.group_type as ProductGroupType | undefined) ?? 'dynamic';
        group.criteria = (raw.criteria as Record<string, unknown> | undefined) ?? {};
        group.isTemplate = raw.is_template === true;
        group.templateKey = (raw.template_key as string | undefined) ?? null;
        group.createdAt = raw.created_at ? new Date(raw.created_at as string) : null;
        group.updatedAt = raw.updated_at ? new Date(raw.updated_at as string) : null;

        return group;
    }
}
