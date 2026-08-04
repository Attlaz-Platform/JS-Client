import {Utils} from '../../Utils.js';
import {ApiRecord} from '../../Model/ApiRecord.js';
import {DataValueValue} from '../../Model/DataValue.js';
import {DataValueCollection} from '../../Model/DataValueCollection.js';
import {LogLevel} from './LogLevel.js';
import {LogStatus} from './LogStatus.js';
import {LogStreamId} from './LogStreamId.js';

export class Log {
    public id: string;
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

    public static parse(rawLog: ApiRecord): Log {
        const date: Date = Utils.parseRawDate(rawLog.date as Date);
        const level: LogLevel = LogLevel.fromString(rawLog.level as string);
        const logStream: LogStreamId = new LogStreamId(rawLog.log_stream as string);
        const log: Log = new Log(logStream, rawLog.message as string, level, date);
        log.id = rawLog.id as string;
        log.context = rawLog.context as object;

        if (rawLog.status !== null && rawLog.status !== undefined && rawLog.status !== '') {
            log.status = LogStatus.fromString(rawLog.status as string);
        }
        log.tags = DataValueCollection.fromObject(rawLog.tags as { key: string, value: DataValueValue }[] | null);
        log._version = rawLog._version as string;
        return log;
    }
}
