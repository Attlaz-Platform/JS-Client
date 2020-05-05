import {LogLevel} from './LogLevel';

export class LogQuery {

    public message: string = null;
    public resolved: boolean = null;
    public logLevels: LogLevel[];
    public tags: Array<{ key: string, value: string }>;

    public pageSize: number = 1000;
    public pageNum: number = 0;

    public sort: Array<{ field: string, direction: number }>;

    public constructor() {
    }

}
