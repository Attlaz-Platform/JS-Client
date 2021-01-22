import {LogLevel} from "./LogLevel";

export class Log {
    public id: string;
    public date: Date;
    public level: LogLevel;
    public message: string;
    public context: object;
    public resolved: boolean = false;
    public tags: Array<{ key: string, value: string }> = [];
    public ignored: boolean = false;
    public _version: string;

    public constructor() {

    }

    public static parse(rawLog: any): Log {
        let log: Log = new Log();
        log.id = rawLog.id;
        log.date = new Date(rawLog.date);
        log.level = LogLevel.fromString(rawLog.level);
        log.message = rawLog.message;
        log.context = rawLog.context;
        log.resolved = rawLog.resolved;
        log.tags = rawLog.tags;
        log.ignored = rawLog.ignored;
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
