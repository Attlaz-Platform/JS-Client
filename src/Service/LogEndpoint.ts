import {Endpoint} from './Endpoint';
import {LogQuery} from '../Model/Log/LogQuery';
import {Log} from '../Model/Log/Log';
import {Utils} from '../Utils';
import {LogStreamId} from '../Model/Log/LogStreamId';
import {CollectionResult} from '../Model/Result/CollectionResult';
import {ObjectResult} from '../Model/Result/ObjectResult';
import {LogStreamInformation} from '../Model/Log/LogStreamInformation';
import {LogStream} from '../Model/Log/LogStream';
import {CursorPagination} from '../Model/Pagination/CursorPagination';
import {QueryString} from '../Http/Data/QueryString';

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

            //TODO: map this
            for (const tag of logQuery.tags) {
                arrTags.push(tag.key + ':' + tag.values);
            }
            const strTags: string = arrTags.join(',');

            arrQuery.push('tags=' + strTags);
        }

        let cmd: string = '/logstreams/' + Utils.base64encode(logQuery.logStreamId.id) + '/logs/?' + arrQuery.join('&');

        const result: CollectionResult<Log> = await this.requestCollection(cmd, Log.parse);
        return result;
    }

    public async getCursoredLogEntries(logStreamId: LogStreamId, pagination: CursorPagination | null): Promise<CollectionResult<Log>> {

        const queryString: QueryString = this.buildQuery(pagination);

        let cmd: string = '/logstreams/' + Utils.base64encode(logStreamId.id) + '/logs' + queryString.build()

        const result: CollectionResult<Log> = await this.requestCollection(cmd, Log.parse);
        return result;
    }

    public async save(log: Log): Promise<Log> {

        try {
            let cmd: string = '/logstreams/' + Utils.base64encode(log.logStream.id) + '/logs';

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

        let cmd: string = '/logstreams/:streamId/logs/' + logId;

        try {
            const parser = (raw: any): { deleted: boolean } => {
                return {deleted: raw.deleted}
            };

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
        let cmd: string = '/logstreams/' + Utils.base64encode(logStreamId.id) + '/clear';

        try {
            const parser = (raw: any): { cleared: boolean } => {
                return {cleared: raw.cleared}
            };
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
            let url: string = '/logstreams/' + Utils.base64encode(logStreamId.id) + '/info';

            const result: ObjectResult<LogStreamInformation> = await this.requestObject(url, null, LogStreamInformation.parse);

            return result.getData();

        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load log stream information: ', error);
            }

            throw error;
        }
    }

    public async getByProject(projectId: string): Promise<CollectionResult<LogStream>> {
        const parser = (raw: any): LogStream => {
            return new LogStream(new LogStreamId(raw['id']), raw['name']);
        }
        const result: CollectionResult<LogStream> = await this.requestCollection('projects/' + projectId + '/logstreams', parser);
        return result;
    }
}
