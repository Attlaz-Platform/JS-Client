import {ApiRecord} from '../../Model/ApiRecord.js';

/** What a report call did: how much was ingested, and how much it resolved. */
export class QualityReportResult {
    public entityCount: number = 0;
    public problemCount: number = 0;
    /** Problems closed because the reporter said the code now passes on that entity. */
    public resolvedCount: number = 0;

    public static parse(raw: ApiRecord): QualityReportResult {
        const result: QualityReportResult = new QualityReportResult();
        result.entityCount = Number(raw.entity_count ?? 0);
        result.problemCount = Number(raw.problem_count ?? 0);
        result.resolvedCount = Number(raw.resolved_count ?? 0);

        return result;
    }
}
