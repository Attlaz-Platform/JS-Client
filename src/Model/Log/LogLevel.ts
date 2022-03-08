import {Utils} from '../../Utils';

export enum LogLevel {
    Debug = "debug",
    Info = "info",
    Notice = "notice",
    Warning = "warning",
    Error = "error",
    Critical = "critical",
    Alert = "alert",
    Emergency = "emergency",
}

export namespace LogLevel {

    export function compare(logLevelA: LogLevel, logLevelB: LogLevel): number {
        let logLevelANumeric: number = LogLevel.toNumeric(logLevelA);
        let logLevelBNumeric: number = LogLevel.toNumeric(logLevelB);
        if (logLevelANumeric > logLevelBNumeric) {
            return 1;
        }
        if (logLevelANumeric < logLevelBNumeric) {
            return -1;
        }
        return 0
    }

    export function toNumeric(logLevel: LogLevel): number {
        switch (logLevel) {
            case LogLevel.Debug:
                return 100;
            case LogLevel.Info:
                return 200;
            case LogLevel.Notice:
                return 250;
            case LogLevel.Warning:
                return 300;
            case LogLevel.Error:
                return 400;
            case LogLevel.Critical:
                return 500;
            case LogLevel.Alert:
                return 550;
            case LogLevel.Emergency:
                return 600;

            default:
                throw new Error('Unknown log level "' + logLevel + '"');
        }
    }

    export function fromString(input: string): LogLevel {
        const result: LogLevel | null = Utils.parseEnum<LogLevel>(input, LogLevel);
        if (result === null) {
            throw new Error('Unable to parse LogLevel from string: Unknown LogLevel "' + input + '"');
        }
        return result;

    }

}
