import {Utils} from '../../Utils.js';

export enum WorkspaceMemberRole {
    Owner = 'owner',
    Administrator = 'administrator',
    Developer = 'developer',
    Analyst = 'analyst',
    Support = 'support',
    ViewOnly = 'view_only'

}

export namespace WorkspaceMemberRole {

    export function fromString(input: string): WorkspaceMemberRole {
        const result: WorkspaceMemberRole | null = Utils.parseEnum<WorkspaceMemberRole>(input, WorkspaceMemberRole);
        if (result === null) {
            throw new Error('Unable to parse WorkspaceMemberRole from string: Unknown WorkspaceMemberRole "' + input + '"');
        }
        return result;

    }

}
