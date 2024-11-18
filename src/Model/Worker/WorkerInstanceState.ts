import {Utils} from '../../Utils.js';

export enum WorkerInstanceState {
    Started = 'Started',
    Stopped = 'Stopped',
    Error = 'Error',
}

export namespace WorkerInstanceState {
    export const fromString = (input: string): WorkerInstanceState => {
        const result: WorkerInstanceState | null = Utils.parseEnum<WorkerInstanceState>(input, WorkerInstanceState);
        if (result === null) {
            throw new Error('Unable to parse WorkerInstanceState from string: Unknown WorkerInstanceState "' + input + '"');
        }
        return result;
    }
}
