import {Utils} from '../../Utils.js';

/**
 * Status values as stored in flow_run_history (distinct from FlowRunStatus, the derived run state).
 * Notably `started`/`success` here vs `running`/`complete` on FlowRunStatus — reusing FlowRunStatus
 * to parse history rows would throw on those two values and silently drop them.
 */
export enum FlowRunHistoryStatus {
    Pending = 'pending',
    Started = 'started',
    Success = 'success',
    Failed = 'failed',
    Stopped = 'stopped',
    Canceled = 'canceled',
}

export namespace FlowRunHistoryStatus {
    export const fromString = (input: string): FlowRunHistoryStatus => {
        const result: FlowRunHistoryStatus | null = Utils.parseEnum<FlowRunHistoryStatus>(input, FlowRunHistoryStatus);
        if (result === null) {
            throw new Error('Unable to parse FlowRunHistoryStatus from string: Unknown FlowRunHistoryStatus "' + input + '"');
        }
        return result;
    }
}
