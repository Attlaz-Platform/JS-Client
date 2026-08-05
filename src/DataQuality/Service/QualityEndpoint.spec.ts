import {QualityEndpoint} from './QualityEndpoint.js';
import {QualityReportEntity} from '../Model/QualityReportEntity.js';
import {QualityReportProblem} from '../Model/QualityReportProblem.js';
import {QualityReportResult} from '../Model/QualityReportResult.js';
import {ApiError} from '../../Model/Error/ApiError.js';
import {ITransport} from '../../Http/Transport/ITransport.js';

type Sent = { action: string; parameters: any; method: string };

/** Records what the endpoint would send, and answers with a canned response. */
function recordingTransport(response: unknown = {}): { transport: ITransport; sent: Sent[] } {
    const sent: Sent[] = [];
    const transport = {
        isDebugEnabled: (): boolean => false,
        reportParseError: (): void => undefined,
        request: async (action: string, parameters: any, method: string): Promise<unknown> => {
            sent.push({action, parameters, method});
            return response;
        },
    } as unknown as ITransport;

    return {transport, sent};
}

/** A transport that fails the way the API does for an unknown dataset. */
function notFoundTransport(): ITransport {
    return {
        isDebugEnabled: (): boolean => false,
        reportParseError: (): void => undefined,
        request: async (): Promise<never> => {
            const error: Error & { httpStatus?: number } = new Error('Not found');
            error.httpStatus = 404;
            throw error;
        },
    } as unknown as ITransport;
}

function entityWithProblem(): QualityReportEntity {
    const entity: QualityReportEntity = new QualityReportEntity('product', 'SKU-1');
    entity.name = 'Blue lamp';
    entity.imageUrl = 'https://example.test/lamp.jpg';
    entity.problems = [new QualityReportProblem('shop.ean_invalid_checkdigit', 'ean')];
    entity.passed = ['shop.name_too_short'];

    return entity;
}

describe('QualityEndpoint ingest', () => {
    test('sends the report payload with the keys the API expects', async () => {
        const {transport, sent} = recordingTransport({entity_count: 1, problem_count: 1, resolved_count: 0});
        const endpoint: QualityEndpoint = new QualityEndpoint(transport);

        await endpoint.reportToScan('DS1', 'SCAN1', [entityWithProblem()]);

        expect(sent).toHaveLength(1);
        expect(sent[0]!.action).toBe('/data-quality/datasets/DS1/scans/SCAN1/report');
        expect(sent[0]!.method).toBe('POST');

        const entity = sent[0]!.parameters.entities[0];
        // The client's key formatter snake_cases keys AND strips a trailing `_id`, which would turn
        // `entity_id` into `entity` and make the API reject the report. The body is sent verbatim
        // instead, so these keys must survive exactly.
        expect(entity.entity_id).toBe('SKU-1');
        expect(entity).not.toHaveProperty('entity');
        expect(entity.entity_type).toBe('product');
        expect(entity.image_url).toBe('https://example.test/lamp.jpg');
        expect(entity.problems[0].code).toBe('shop.ean_invalid_checkdigit');
        expect(entity.passed).toEqual(['shop.name_too_short']);
    });

    test('does not leak the verbatim-body marker to the API', async () => {
        const {transport, sent} = recordingTransport({entity_count: 0, problem_count: 0, resolved_count: 0});
        const endpoint: QualityEndpoint = new QualityEndpoint(transport);

        await endpoint.reportToScan('DS1', 'SCAN1', [entityWithProblem()]);

        expect(sent[0]!.parameters).not.toHaveProperty('_formatted');
    });

    test('parses the counts the API returns', async () => {
        const {transport} = recordingTransport({entity_count: 3, problem_count: 7, resolved_count: 2});
        const endpoint: QualityEndpoint = new QualityEndpoint(transport);

        const result: QualityReportResult = await endpoint.reportToScan('DS1', 'SCAN1', [entityWithProblem()]);

        expect(result.entityCount).toBe(3);
        expect(result.problemCount).toBe(7);
        expect(result.resolvedCount).toBe(2);
    });

    test('sends the pack on a single-shot report', async () => {
        const {transport, sent} = recordingTransport({entity_count: 1, problem_count: 0, resolved_count: 0});
        const endpoint: QualityEndpoint = new QualityEndpoint(transport);

        await endpoint.reportProblems('DS1', [entityWithProblem()], 'my-checks');

        expect(sent[0]!.action).toBe('/data-quality/datasets/DS1/problems');
        expect(sent[0]!.parameters.pack).toBe('my-checks');
    });

    // A write that lands nowhere must not look like a report that changed nothing: a reporter would
    // log success while its problems went missing.
    describe('a write that returns nothing throws', () => {
        test.each([
            ['openScan', (endpoint: QualityEndpoint) => endpoint.openScan('MISSING')],
            ['reportToScan', (endpoint: QualityEndpoint) => endpoint.reportToScan('MISSING', 'S1', [entityWithProblem()])],
            ['completeScan', (endpoint: QualityEndpoint) => endpoint.completeScan('MISSING', 'S1')],
            ['reportProblems', (endpoint: QualityEndpoint) => endpoint.reportProblems('MISSING', [entityWithProblem()])],
        ])('%s', async (_name: string, call: (endpoint: QualityEndpoint) => Promise<unknown>) => {
            const endpoint: QualityEndpoint = new QualityEndpoint(notFoundTransport());

            await expect(call(endpoint)).rejects.toBeInstanceOf(ApiError);
        });
    });
});
