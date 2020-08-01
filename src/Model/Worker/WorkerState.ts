import {Utils} from '../../Utils';

export enum WorkerState {
    Active = 'Active' as any,
    Inactive = 'Inactive' as any,
    NonExisting = 'NonExisting' as any,
}

export namespace WorkerState {

    export function fromString(input: string): WorkerState {
        const result: WorkerState = Utils.parseEnum<WorkerState>(input, WorkerState);
        if (Utils.isNullOrUndefined(result)) {
            throw new Error('Unable to parse WorkerState from string: Unknown WorkerState "' + input + '"');
        }
        return result;
    }

}
