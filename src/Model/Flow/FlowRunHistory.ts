import {Utils} from '../../Utils.js';
import {ApiRecord} from '../ApiRecord.js';
import {FlowRunHistoryStatus} from './FlowRunHistoryStatus.js';

export class FlowRunHistory {
    public id: string;
    public time: Date;
    public status: FlowRunHistoryStatus;

    public static parse(rawFlowRunHistory: ApiRecord): FlowRunHistory {
        const flowRunHistory: FlowRunHistory = new FlowRunHistory();
        flowRunHistory.id = rawFlowRunHistory.id as string;
        flowRunHistory.time = Utils.parseRawDate(rawFlowRunHistory.time as Date);
        flowRunHistory.status = FlowRunHistoryStatus.fromString(rawFlowRunHistory.status as string);

        return flowRunHistory;
    }
}
