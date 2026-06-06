export enum CommandExecutionStatus {
    Pending = 'pending',
    Running = 'running',
    Completed = 'completed',
    Failed = 'failed',
}

export namespace CommandExecutionStatus {

    export const fromString = (input: string): CommandExecutionStatus => {
        switch (input) {
            case CommandExecutionStatus.Pending:
            case CommandExecutionStatus.Running:
            case CommandExecutionStatus.Completed:
            case CommandExecutionStatus.Failed:
                return input as CommandExecutionStatus;
            default:
                throw new Error('Unknown CommandExecutionStatus "' + input + '"');
        }
    }
}
