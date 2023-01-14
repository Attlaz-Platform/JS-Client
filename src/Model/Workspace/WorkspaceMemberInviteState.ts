import {Utils} from '../../Utils';

export enum WorkspaceMemberInviteState {
    Pending = 'pending',
    Declined = 'declined',
    Accepted = 'accepted',
    Revoked = 'revoked',
    Expired = 'expired',
    Removed = 'removed',

}

export namespace WorkspaceMemberInviteState {

    export function fromString(input: string): WorkspaceMemberInviteState {
        const result: WorkspaceMemberInviteState | null = Utils.parseEnum<WorkspaceMemberInviteState>(input, WorkspaceMemberInviteState);
        if (result === null) {
            throw new Error('Unable to parse WorkspaceMemberInviteState from string: Unknown TeamMemberInviteState "' + input + '"');
        }
        return result;

    }

}
