import {Utils} from '../..';

export enum WorkerInstanceState {
    Started = 'Started' as any,
    Stopped = 'Stopped' as any,
}

export namespace WorkerInstanceState {
    export function fromString(input: string): WorkerInstanceState {
        const result: WorkerInstanceState = Utils.parseEnum<WorkerInstanceState>(input, WorkerInstanceState);
        if (Utils.isNullOrUndefined(result)) {
            throw new Error('Unable to parse WorkerInstanceState from string: Unknown WorkerInstanceState "' + input + '"');
        }
        return result;
    }
}
