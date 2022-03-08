import {Utils} from '../../Utils';

export enum WorkerState {
    Active = 'Active',
    Active_Upgrading = 'Upgrading',
    Active_Upgraded = 'Upgraded',

    Inactive = 'Inactive',
    NonExisting = 'NonExisting',
}

export namespace WorkerState {
    export function fromString(input: string): WorkerState {
        const result: WorkerState | null = Utils.parseEnum<WorkerState>(input, WorkerState);
        if (result === null) {
            throw new Error('Unable to parse WorkerState from string: Unknown WorkerState "' + input + '"');
        }
        return result;
    }
}
