import {LogLevel} from './LogLevel';
import {LogStreamId} from './LogStreamId';
import {DataValueValue} from '../DataValue';

export class LogItemFilter {
    public logLevels: LogLevel[] | null = null;
    public tags: Array<{ key: string, values: DataValueValue[] }> | null = null;

}
