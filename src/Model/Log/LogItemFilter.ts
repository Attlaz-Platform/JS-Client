import {LogLevel} from './LogLevel.js';
import {DataValueValue} from '../DataValue.js';

export class LogItemFilter {
    public logLevels: LogLevel[] | null = null;
    public tags: Array<{ key: string, values: DataValueValue[] }> | null = null;
}
