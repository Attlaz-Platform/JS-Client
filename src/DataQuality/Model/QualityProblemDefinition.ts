import {ApiRecord} from '../../Model/ApiRecord.js';

/**
 * The catalogue entry behind a problem code — the `/data_quality/definitions` resource.
 *
 * A code is a machine key (`verlichting.ean_invalid_checkdigit`); the definition is what makes it
 * readable, so anything showing a code to a user should resolve it here. Definitions are either
 * platform-owned (`ownerProject` null, shipped by Attlaz) or owned by a project, and a project's
 * own definition takes precedence over a platform one with the same code.
 *
 * `blocking` is orthogonal to `defaultSeverity`: severity is how bad the problem is, blocking is
 * whether the entity can be published to a channel at all.
 */
export class QualityProblemDefinition {
    public id: string;
    public code: string;
    public ownerProject: string | null = null;

    public label: string | null = null;
    public description: string | null = null;
    public dimension: string | null = null;
    public defaultSeverity: string | null = null;
    public blocking: boolean = false;
    public helpUrl: string | null = null;
    public pack: string | null = null;
    public property: string | null = null;

    public constructor(id: string, code: string) {
        this.id = id;
        this.code = code;
    }

    /** What to show a user for this code: the label when it has one, the raw code otherwise. */
    public get displayName(): string {
        return this.label ?? this.code;
    }

    public static parse(raw: ApiRecord): QualityProblemDefinition {
        const definition: QualityProblemDefinition = new QualityProblemDefinition(raw.id as string, raw.code as string);
        definition.ownerProject = (raw.owner_project as string | undefined) ?? null;
        definition.label = (raw.label as string | undefined) ?? null;
        definition.description = (raw.description as string | undefined) ?? null;
        definition.dimension = (raw.dimension as string | undefined) ?? null;
        definition.defaultSeverity = (raw.default_severity as string | undefined) ?? null;
        definition.blocking = raw.blocking === true;
        definition.helpUrl = (raw.help_url as string | undefined) ?? null;
        definition.pack = (raw.pack as string | undefined) ?? null;
        definition.property = (raw.property as string | undefined) ?? null;

        return definition;
    }
}
