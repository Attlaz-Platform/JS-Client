import {DataValueCollection} from '../DataValueCollection.js';
import {CommandExecutionStatus} from './CommandExecutionStatus.js';

export class CommandExecutionHistory {
    public id: string;
    public commandType: string;
    public commandTime: Date;
    public commandData: DataValueCollection;
    public commandVersion: string;
    // The user that requested the command (the platform system user for cron/event/maintenance commands).
    public requestedBy: string;
    public executionStarted: Date | null;
    public executionFinished: Date | null;
    public executionStatus: CommandExecutionStatus;
    public executionError: string | null;
    // Structured result payload as a JSON string (e.g. '{"removedCount": 1234}'); shape depends on the command type.
    public executionResult: string | null;
}
