/**
 * Display/filter status of a user API key. Mirrors the server enum
 * (Library/Core Attlaz-OAuth/Model/UserAccessTokenStatus). Folds the derived "expired" concept
 * (computed from the expiry date, not stored) on top of the stored state.
 */
export enum UserAccessTokenStatus {
    Active = 'active',
    Inactive = 'inactive',
    Expired = 'expired',
    Revoked = 'revoked',
}
