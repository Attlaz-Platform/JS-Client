import {Utils} from '../../Utils';

export enum ProjectDeployStatus {
    Unknown = 'unknown' as any,
    Pending = 'pending' as any,
    Canceled = 'canceled' as any,
    Running = 'running' as any,
    Failed = 'failed' as any,
    Stopped = 'stopped' as any,
    Complete = 'complete' as any,
}

export namespace ProjectDeployStatus {
    export function fromString(input: string): ProjectDeployStatus {
        const result: ProjectDeployStatus = Utils.parseEnum<ProjectDeployStatus>(input, ProjectDeployStatus);
        if (Utils.isNullOrUndefined(result)) {
            throw new Error('Unable to parse ProjectDeployStatus from string: Unknown ProjectDeployStatus "' + input + '"');
        }
        return result;
    }
}
