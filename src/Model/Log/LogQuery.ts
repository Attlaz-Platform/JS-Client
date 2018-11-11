import {LogType} from './LogType';
import {LogLevel} from './LogLevel';

export class LogQuery {

    public type: LogType = null;
    public resolved: boolean = null;
    public logLevels: LogLevel[];
    public tags: Array<{ key: string, value: string }>;

    public pageSize: number = 1000;
    public pageNum: number = 0;

    public constructor(type: LogType) {
        this.type = type;
    }
}