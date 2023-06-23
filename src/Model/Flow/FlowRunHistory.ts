import {FlowRunStatus} from './FlowRunStatus.js';
import {Utils} from '../../Utils.js';

export class FlowRunHistory {
    public id: number;
    public time: Date;
    public status: FlowRunStatus;

    public static parse(rawFlowRunHistory: any): FlowRunHistory {
        const flowRunHistory: FlowRunHistory = new FlowRunHistory();
        flowRunHistory.id = rawFlowRunHistory.id;
        flowRunHistory.time = Utils.parseRawDate(rawFlowRunHistory.time);
        flowRunHistory.status = FlowRunStatus.fromString(rawFlowRunHistory.status);

        return flowRunHistory;
    }
}
