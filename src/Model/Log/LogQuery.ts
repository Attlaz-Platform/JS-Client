import {LogLevel} from './LogLevel.js';
import {LogStreamId} from './LogStreamId.js';
import {DataValueValue} from '../DataValue.js';

export class LogQuery {

    public readonly logStreamId: LogStreamId;
    public message: string | null = null;
    public hidden: boolean | null = null;
    public logLevels: LogLevel[] | null = null;
    public tags: Array<{ key: string, values: DataValueValue[] }> | null = null;
    public limit: number | null = null;
    public startingAfterId: string | null = null;
    public sort: Array<{ field: string, direction: number }>;

    public constructor(logStreamId: LogStreamId) {
        this.logStreamId = logStreamId;
    }

}
