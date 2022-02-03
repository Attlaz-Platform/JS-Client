import {LogLevel} from "./LogLevel";
import {LogStreamId} from './LogStreamId';

export class Log {
    public id: string;
    public readonly logStream: LogStreamId;
    public readonly date: Date;
    public readonly level: LogLevel;
    public message: string;
    public context: object;
    public tags: Array<{ key: string, value: string }> = [];
    public _version: string;

    public constructor(logStream: LogStreamId, level: LogLevel, date: Date) {
        this.logStream = logStream;
        this.level = level;
        this.date = date;
    }

    public static parse(rawLog: any): Log {
        const date: Date = new Date(rawLog.date);
        const level: LogLevel = LogLevel.fromString(rawLog.level);
        const logStream: LogStreamId = new LogStreamId(rawLog.logStream.id);
        let log: Log = new Log(logStream, level, date);
        log.id = rawLog.id;
        log.message = rawLog.message;
        log.context = rawLog.context;
        log.tags = rawLog.tags;
        log._version = rawLog._version;
        return log;
    }

    public setTag(key: string, value: string): void {
        this.tags.push({key, value});
    }

    public getTagValue(key: string): string | null {
        for (const tag of this.tags) {
            if (tag.key === key) {
                return tag.value;
            }
        }
        return null;
    }
}
