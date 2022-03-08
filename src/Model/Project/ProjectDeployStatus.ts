import {Utils} from '../../Utils';

export enum ProjectDeployStatus {
    Unknown = 'unknown',
    Pending = 'pending',
    Canceled = 'canceled',
    Running = 'running',
    Failed = 'failed',
    Stopped = 'stopped',
    Complete = 'complete',
}

export namespace ProjectDeployStatus {
    export function fromString(input: string): ProjectDeployStatus {
        const result: ProjectDeployStatus | null = Utils.parseEnum<ProjectDeployStatus>(input, ProjectDeployStatus);
        if (result === null) {
            throw new Error('Unable to parse ProjectDeployStatus from string: Unknown ProjectDeployStatus "' + input + '"');
        }
        return result;
    }
}
