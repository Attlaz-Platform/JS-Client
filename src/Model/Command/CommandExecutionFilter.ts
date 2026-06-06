import {CommandExecutionStatus} from './CommandExecutionStatus.js';

export interface CommandExecutionFilter {
    // status/type are multi-value (sent as repeated query params); requestedBy is single.
    status?: CommandExecutionStatus[];
    type?: string[];
    // User id of the requester.
    requestedBy?: string;
}
