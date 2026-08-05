/**
 * One problem found on one entity, as sent to the report endpoint.
 *
 * `code` is the machine key the problem definition hangs off (`shop.ean_invalid_checkdigit`);
 * `property` is what the problem is about (`ean`, `name`, `image`). Severity is optional: leave it
 * null and the platform applies the definition's default.
 */
export class QualityReportProblem {
    public code: string;
    public property: string;
    public severity: string | null = null;
    public note: string | null = null;
    public data: Record<string, unknown> | null = null;
    public channel: string | null = null;
    public locale: string | null = null;

    public constructor(code: string, property: string) {
        this.code = code;
        this.property = property;
    }

    /**
     * The snake_case wire shape. Built here rather than left to the client's key formatter, which
     * would rewrite the keys — see QualityReportEntity.toPayload().
     */
    public toPayload(): Record<string, unknown> {
        return {
            code: this.code,
            property: this.property,
            severity: this.severity,
            note: this.note,
            data: this.data,
            channel: this.channel,
            locale: this.locale,
        };
    }
}
