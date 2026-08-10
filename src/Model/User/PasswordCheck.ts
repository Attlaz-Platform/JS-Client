/**
 * Why a password was rejected. `null` means it was accepted.
 *
 * Mirrors the server's `PasswordCheckResult` — duplicated here rather than imported, per the client's
 * standing rule that it does not depend on Core.
 */
export type PasswordCheckCode =
    'password_missing'
    | 'password_not_long_enough'
    | 'password_too_long'
    | 'password_repeat_match'
    | 'password_general_match'
    | 'password_too_weak';

export class PasswordCheck {

    /** Null when the password is acceptable. */
    public code: PasswordCheckCode | null = null;

    /** Human-readable reason, ready to display. Null when the password is acceptable. */
    public error: string | null = null;

    /**
     * zxcvbn score, 0 (weakest) to 4 (strongest). Null when the password was rejected before it was
     * scored — an empty or out-of-bounds password never reaches the estimator.
     *
     * Treat it as a display hint, not a policy: the server owns the threshold, and a low score with
     * `code === null` still means accepted.
     */
    public strength: number | null = null;

    public isAcceptable(): boolean {
        return this.code === null;
    }
}
