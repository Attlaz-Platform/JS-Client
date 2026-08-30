export class CursorPagination {
    /** Guards against a limit no server would honour; mirrors the bound Core validates against. */
    private static readonly MAX_LIMIT: number = 1000000;

    public limit: number | null = null;
    public startingAfter: string | null = null;
    public endingBefore: string | null = null;

    /**
     * `limit` stays optional, and null keeps meaning "let the server decide" — that is a real
     * intent, and what every existing caller wants. What the constructor adds is validation and a
     * way to state a limit in one expression instead of constructing and then assigning.
     *
     * Core's equivalent defaults to 10 because a repository always needs a number. This one must
     * not: defaulting here would silently start sending `limit=10` on every call that omits it.
     */
    public constructor(limit: number | null = null) {
        if (limit !== null) {
            if (!Number.isInteger(limit)) {
                throw new Error('Limit should be a whole number');
            }
            if (limit < 1) {
                throw new Error('Limit should be at least 1');
            }
            if (limit > CursorPagination.MAX_LIMIT) {
                throw new Error('Limit should not exceed ' + CursorPagination.MAX_LIMIT);
            }
        }
        this.limit = limit;
    }
}
