import {Utils} from '../../Utils';

export enum LogLevel {
    Debug = <any>"debug",
    Info = <any>"info",
    Notice = <any>"notice",
    Warning = <any>"warning",
    Error = <any>"error",
    Critical = <any>"critical",
    Alert = <any>"alert",
    Emergency = <any>"emergency",
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

    export function fromString(logLevel: string): LogLevel {
        let result: LogLevel;
        if (Utils.isNullOrUndefined(logLevel)) {
            throw new Error('Unable to parse logLevel from string: logLevel not defined');
        }
        switch (logLevel.toLowerCase()) {
            case 'debug':
                result = LogLevel.Debug;
                break;
            case 'info':
                result = LogLevel.Info;
                break;
            case 'notice':
                result = LogLevel.Notice;
                break;
            case 'warning':
                result = LogLevel.Warning;
                break;
            case 'error':
                result = LogLevel.Error;
                break;
            case 'critical':
                result = LogLevel.Critical;
                break;
            case 'alert':
                result = LogLevel.Alert;
                break;
            case 'emergency':
                result = LogLevel.Emergency;
                break;

            default:
                throw new Error('Unknown log level "' + logLevel + '"');
        }

        return result;
    }

}
