import {QueryString} from '../../Http/Data/QueryString.js';
import {FilterNode} from '../../Model/Filter/FilterNode.js';
import {ApiRecord} from '../../Model/ApiRecord.js';
import {Log} from '../Model/Log.js';
import {LogQuery} from '../Model/LogQuery.js';
import {LogStream} from '../Model/LogStream.js';
import {LogStreamId} from '../Model/LogStreamId.js';
import {LogStreamInformation} from '../Model/LogStreamInformation.js';
import {CursorPagination} from '../../Model/Pagination/CursorPagination.js';
import {CollectionResult} from '../../Model/Result/CollectionResult.js';
import {ObjectResult} from '../../Model/Result/ObjectResult.js';
import {Endpoint} from '../../Service/Endpoint.js';

export class LogEndpoint extends Endpoint {
    public async getLogs(logQuery: LogQuery): Promise<CollectionResult<Log>> {
        const arrQuery: string[] = [];
        if (logQuery.limit !== null) {
            arrQuery.push('limit=' + logQuery.limit);
        }
        if (logQuery.startingAfterId !== null) {
            arrQuery.push('starting_after=' + logQuery.startingAfterId);
        }

        // Resolved
        if (logQuery.hidden !== null && logQuery.hidden !== undefined) {
            if (logQuery.hidden) {
                arrQuery.push('hidden=1');
            } else {
                arrQuery.push('hidden=0');
            }
        }

        // LogLevels
        if (logQuery.logLevels !== null && logQuery.logLevels !== undefined && logQuery.logLevels.length > 0) {
            arrQuery.push('logLevels=' + logQuery.logLevels.join(','));
        }
        // Tags
        if (logQuery.tags !== null && logQuery.tags !== undefined && logQuery.tags.length > 0) {
            const arrTags: string[] = [];

            // TODO: map this
            for (const tag of logQuery.tags) {
                arrTags.push(tag.key + ':' + tag.values);
            }
            const strTags: string = arrTags.join(',');

            arrQuery.push('tags=' + strTags);
        }

        const cmd: string = '/logstreams/' + logQuery.logStreamId.toString() + '/logs/?' + arrQuery.join('&');

        const result: CollectionResult<Log> = await this.requestCollection(cmd, Log.parse);
        return result;
    }

    public async getCursoredLogEntries(logStreamId: LogStreamId, pagination: CursorPagination | null, filter: FilterNode | null): Promise<CollectionResult<Log>> {
        const queryString: QueryString = new QueryString('/logstreams/' + logStreamId.toString() + '/logs');
        queryString.addPagination(pagination);
        if (filter !== null && filter !== undefined) {
            queryString.set('filter', JSON.stringify(filter));
        }

        const result: CollectionResult<Log> = await this.requestCollection(queryString, Log.parse);
        return result;
    }

    public async save(log: Log): Promise<Log> {
        try {
            const cmd: string = '/logstreams/' + log.logStream.toString() + '/logs';

            const result: ObjectResult<Log> = await this.requestObject(cmd, log, Log.parse, 'POST');
            const updatedLogEntry: Log | null = result.getData();
            if (updatedLogEntry === null) {
                throw new Error('Log not updated');
            }
            return updatedLogEntry;
        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to save log: ', error);
            }

            throw error;
        }
    }

    public async delete(logId: string): Promise<boolean> {
        const cmd: string = '/logstreams/:streamId/logs/' + logId;

        try {
            const parser = (raw: any): { deleted: boolean } => ({deleted: raw.deleted});

            const result: ObjectResult<{ deleted: boolean }> = await this.requestObject(cmd, null, parser, 'DELETE');

            const re: { deleted: boolean } | null = result.getData();
            if (re === null) {
                console.log('delete log entry wrong data', {result, parsed: re});
                throw new Error('Unable to delete log entry: wrong response from API');
            }
            return re.deleted;
        } catch (e) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to save log: ', e);
            }
            throw e;
        }
    }

    public async clear(logStreamId: LogStreamId): Promise<boolean> {
        const cmd: string = '/logstreams/' + logStreamId.toString() + '/clear';

        try {
            const parser = (raw: any): { cleared: boolean } => ({cleared: raw.cleared});
            const result: ObjectResult<{ cleared: boolean }> = await this.requestObject(cmd, null, parser, 'POST');
            const re: { cleared: boolean } | null = result.getData();
            if (re === null) {
                console.log('Log stream cleared wrong data', {result, parsed: re});
                throw new Error('Unable to clear log stream: wrong response from API');
            }
            return re.cleared;
        } catch (e) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to save log: ', e);
            }
            throw e;
        }
    }

    public async getInformation(logStreamId: LogStreamId): Promise<LogStreamInformation | null> {
        try {
            const url: string = '/logstreams/' + logStreamId.toString() + '/info';

            const result: ObjectResult<LogStreamInformation> = await this.requestObject(url, null, LogStreamInformation.parse);

            return result.getData();
        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load log stream information: ', error);
            }

            throw error;
        }
    }

    public async getByProject(projectId: string, pagination: CursorPagination | null = null): Promise<CollectionResult<LogStream>> {

        const queryString: QueryString = new QueryString('projects/' + projectId + '/logstreams');
        queryString.addPagination(pagination);
        const parser = (raw: ApiRecord): LogStream => new LogStream(new LogStreamId(raw.id as string), raw.name as string);
        const result: CollectionResult<LogStream> = await this.requestCollection(queryString, parser);
        return result;
    }
}
