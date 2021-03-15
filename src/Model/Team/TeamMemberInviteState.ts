import {Utils} from '../../Utils';

export enum TeamMemberInviteState {
    Pending = 'pending',
    Declined = 'declined',
    Accepted = 'accepted',
    Revoked = 'revoked',
    Expired = 'expired',
    Removed = 'removed',

}

export namespace TeamMemberInviteState {

    export function fromString(input: string): TeamMemberInviteState {
        const result: TeamMemberInviteState = Utils.parseEnum<TeamMemberInviteState>(input, TeamMemberInviteState);
        if (Utils.isNullOrUndefined(result)) {
            throw new Error('Unable to parse TeamMemberInviteState from string: Unknown TeamMemberInviteState "' + input + '"');
        }
        return result;

    }

}
