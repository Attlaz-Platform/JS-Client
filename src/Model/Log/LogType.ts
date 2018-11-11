export enum LogType {
    Infrastructure = 'infrastructure' as any,
    TaskExecution = 'taskexecution' as any,

}

export namespace LogType {

    export function fromString(logType: string): LogType {
        let result: LogType;
        if (logType === null || logType === undefined) {
            throw new Error('Unable to parse logType from string: logType not defined');
        }
        switch (logType.toLowerCase()) {
            case 'infrastructure':
                result = LogType.Infrastructure;
                break;
            case 'taskexecution':
                result = LogType.TaskExecution;
                break;

            default:
                throw new Error('Unknown log type "' + logType + '"');
        }

        return result;
    }

}
