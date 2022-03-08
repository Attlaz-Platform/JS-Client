import {LogLevel} from './LogLevel';
import {LogStreamId} from './LogStreamId';
import {DataValueValue} from '../DataValue';

export class LogQuery {

    public readonly logStreamId: LogStreamId;

    public message: string | null = null;
    public hidden: boolean | null = null;
    public logLevels: LogLevel[];
    public tags: Array<{ key: string, values: DataValueValue[] }>;

    public pageSize: number = 1000;
    public pageNum: number = 0;

    public sort: Array<{ field: string, direction: number }>;

    public constructor(logStreamId: LogStreamId) {
        this.logStreamId = logStreamId;
    }

}
