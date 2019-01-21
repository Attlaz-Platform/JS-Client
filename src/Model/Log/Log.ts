import {LogLevel} from "./LogLevel";
import {LogType} from './LogType';

export class Log {
    public id: string;
    public date: Date;
    public level: LogLevel;
    public message: string;
    public type: LogType;
    public context: object;
    public _version: string;

    public constructor() {

    }

    public static parse(rawLog: any): Log {
        let log: Log = new Log();
        log.id = rawLog.id;
        log.date = new Date(rawLog.date);
        log.level = LogLevel.fromString(rawLog.level);
        log.message = rawLog.message;
        log.type = LogType.fromString(rawLog.type);
        log.context = rawLog.context;
        log._version = rawLog._version;
        return log;
    }
}
