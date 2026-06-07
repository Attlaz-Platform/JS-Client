import {State} from '../State.js';

export type UserSummaryType = 'user' | 'system';

/**
 * Display-safe view of a user (no email/PII). Resolved via UserEndpoint.getSummaries().
 * `state` drives the badge (reuses the global State enum); `null` = not resolvable for this caller.
 * `displayName` is always safe to show ("System", "Removed user", "Unknown user" for the edge cases).
 */
export class UserSummary {
    public id: string;
    public type: UserSummaryType;
    public state: State | null;
    public displayName: string;
}
