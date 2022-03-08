import {LogLevel} from "./LogLevel";
import {LogStreamId} from './LogStreamId';
import {LogStatus} from './LogStatus';
import {DataValueCollection} from '../DataValueCollection';

export class Log {
    public id: string | null = null;
    public readonly logStream: LogStreamId;
    public readonly date: Date;
    public readonly level: LogLevel;
    public readonly message: string;
    public context: object;

    public status: LogStatus = LogStatus.Normal;

    public tags: DataValueCollection;

    public _version: string;

    public constructor(logStream: LogStreamId, message: string, level: LogLevel, date: Date) {
        this.logStream = logStream;
        this.message = message;
        this.level = level;
        this.date = date;
        this.tags = new DataValueCollection();
    }

    public static parse(rawLog: any): Log {
        const date: Date = new Date(rawLog.date);
        const level: LogLevel = LogLevel.fromString(rawLog.level);
        const logStream: LogStreamId = new LogStreamId(rawLog.logStream.id);
        let log: Log = new Log(logStream, rawLog.message, level, date);
        log.id = rawLog.id;
        log.context = rawLog.context;

        if (rawLog.status !== null && rawLog.status !== undefined && rawLog.status !== '') {
            log.status = LogStatus.fromString(rawLog.status);
        }

        log.tags = DataValueCollection.fromObject(rawLog.tags);

        log._version = rawLog._version;
        return log;
    }

}
