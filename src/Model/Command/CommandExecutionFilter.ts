import {CommandExecutionStatus} from './CommandExecutionStatus.js';

export interface CommandExecutionFilter {
    // status/type/requestedBy are all multi-value (sent as repeated query params).
    status?: CommandExecutionStatus[];
    type?: string[];
    // User ids of the requesters.
    requestedBy?: string[];
}
