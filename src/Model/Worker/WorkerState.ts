export enum WorkerState {
    Active = 'Active' as any,
    Inactive = 'Inactive' as any,
    NonExisting = 'NonExisting' as any,
}

export namespace WorkerState {

    export function fromString(workerState: string): WorkerState {

        let result: WorkerState;
        if (workerState === null || workerState == undefined) {
            throw new Error('Unable to parse WorkerState from string: WorkerState not defined');
        }
        switch (workerState.toLowerCase()) {
            case 'active':
                result = WorkerState.Active;
                break;
            case 'inactive':
                result = WorkerState.Inactive;
                break;
            case 'nonexisting':
                result = WorkerState.NonExisting;
                break;

            default:
                throw new Error('Unknown log WorkerState "' + workerState + '"');
        }

        return result;
    }

}
