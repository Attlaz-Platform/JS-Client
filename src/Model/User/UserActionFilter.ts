/**
 * Filters for the audit-log list. userIds is multi-value; entityId is a single prefixed entity id;
 * timeFrom/timeTo bound the action time (inclusive). All optional.
 */
export interface UserActionFilter {
    userIds?: string[];
    entityId?: string;
    timeFrom?: Date;
    timeTo?: Date;
}
