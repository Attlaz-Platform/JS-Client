import {Utils} from '../../Utils';

export enum TeamMemberRole {
    Administrator = 'administrator',
    Developer = 'developer',
    Analyst = 'analyst',
    Support = 'support',
    ViewOnly = 'view_only'

}

export namespace TeamMemberRole {

    export function fromString(input: string): TeamMemberRole {
        const result: TeamMemberRole | null = Utils.parseEnum<TeamMemberRole>(input, TeamMemberRole);
        if (result === null) {
            throw new Error('Unable to parse TeamMemberRole from string: Unknown TeamMemberRole "' + input + '"');
        }
        return result;

    }

}
