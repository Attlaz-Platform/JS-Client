import {Utils} from '../../Utils.js';
import {ApiRecord} from '../ApiRecord.js';
import {FlowRunStatus} from './FlowRunStatus.js';

/**
 * The authoritative lifecycle of a flow run, as derived server-side from its event history
 * (first-terminal-wins). Unlike FlowRunSummary, which reflects the (eventually-consistent) index
 * projection, this is computed directly from the history and is safe for control-flow decisions
 * such as the worker's "is this run already terminal?" tombstone check.
 */
export class FlowRunLifecycle {
    public id: string;
    public status: FlowRunStatus;
    public requested: Date | null;
    public started: Date | null;
    public ended: Date | null;

    public static parse(rawFlowRunLifecycle: ApiRecord): FlowRunLifecycle {
        const lifecycle: FlowRunLifecycle = new FlowRunLifecycle();
        lifecycle.id = rawFlowRunLifecycle.id as string;
        lifecycle.status = FlowRunStatus.fromString(rawFlowRunLifecycle.status as string);
        lifecycle.requested = rawFlowRunLifecycle.requested === null || rawFlowRunLifecycle.requested === undefined ? null : Utils.parseRawDate(rawFlowRunLifecycle.requested as Date);
        lifecycle.started = rawFlowRunLifecycle.started === null || rawFlowRunLifecycle.started === undefined ? null : Utils.parseRawDate(rawFlowRunLifecycle.started as Date);
        lifecycle.ended = rawFlowRunLifecycle.ended === null || rawFlowRunLifecycle.ended === undefined ? null : Utils.parseRawDate(rawFlowRunLifecycle.ended as Date);

        return lifecycle;
    }
}
