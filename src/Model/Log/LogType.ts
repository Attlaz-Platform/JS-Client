import {Utils} from '../../Utils';
import {State} from '../State';

/**
 * @deprecated
 */
export enum LogType {
    Infrastructure = 'infrastructure' as any,
    TaskExecution = 'taskexecution' as any,

}

export namespace LogType {
    export function fromString(input: string): LogType {
        const result: LogType = Utils.parseEnum<LogType>(input, State);
        if (Utils.isNullOrUndefined(result)) {
            throw new Error('Unable to parse LogType from string: Unknown LogType "' + input + '"');
        }
        return result;
    }
}
