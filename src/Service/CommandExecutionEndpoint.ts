import {QueryString} from '../Http/Data/QueryString.js';
import {CommandExecutionFilter} from '../Model/Command/CommandExecutionFilter.js';
import {CommandExecutionHistory} from '../Model/Command/CommandExecutionHistory.js';
import {CommandExecutionStatus} from '../Model/Command/CommandExecutionStatus.js';
import {DataValueCollection} from '../Model/DataValueCollection.js';
import {CursorPagination} from '../Model/Pagination/CursorPagination.js';
import {CollectionResult} from '../Model/Result/CollectionResult.js';
import {ObjectResult} from '../Model/Result/ObjectResult.js';
import {Utils} from '../Utils.js';
import {Endpoint} from './Endpoint.js';

export class CommandExecutionEndpoint extends Endpoint {

    public async getAll(pagination: CursorPagination | null = null, filter: CommandExecutionFilter | null = null): Promise<CollectionResult<CommandExecutionHistory>> {
        const queryString: QueryString = new QueryString('/system/command-executions');
        queryString.addPagination(pagination);
        if (filter !== null) {
            if (filter.status !== undefined && filter.status.length > 0) {
                queryString.set('status', filter.status);
            }
            if (filter.type !== undefined && filter.type.length > 0) {
                queryString.set('type', filter.type);
            }
            if (filter.requestedBy !== undefined) {
                queryString.set('requested_by', filter.requestedBy);
            }
        }
        return await this.requestCollection<CommandExecutionHistory>(queryString, CommandExecutionEndpoint.parse, null, 'GET');
    }

    public async getById(id: string): Promise<CommandExecutionHistory | null> {
        const queryString: QueryString = new QueryString('/system/command-executions/' + id);
        const result: ObjectResult<CommandExecutionHistory> = await this.requestObject<CommandExecutionHistory>(queryString, null, CommandExecutionEndpoint.parse, 'GET');
        return result.getData();
    }

    private static parse(raw: Record<string, unknown>): CommandExecutionHistory {
        const history: CommandExecutionHistory = new CommandExecutionHistory();
        history.id = raw.id as string;
        history.commandType = raw.command_type as string;
        history.commandTime = Utils.parseRawDate(raw.command_time as Date);
        history.commandData = DataValueCollection.fromObject(raw.command_data as any);
        history.commandVersion = raw.command_version as string;
        history.requestedBy = raw.requested_by as string;
        history.executionStarted = (raw.execution_started === null || raw.execution_started === undefined) ? null : Utils.parseRawDate(raw.execution_started as Date);
        history.executionFinished = (raw.execution_finished === null || raw.execution_finished === undefined) ? null : Utils.parseRawDate(raw.execution_finished as Date);
        history.executionStatus = CommandExecutionStatus.fromString(raw.execution_status as string);
        history.executionError = (raw.execution_error as string | null) ?? null;
        history.executionResult = (raw.execution_result as string | null) ?? null;
        return history;
    }
}
