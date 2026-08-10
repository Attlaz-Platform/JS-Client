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
    public strength: PasswordStrength | null = null;
}

export type PasswordStrength = 0 | 1 | 2 | 3 | 4;

export namespace PasswordStrength {

    /**
     * Throws on anything outside 0–4, rather than degrading to null.
     *
     * Null does not mean "unknown" here — it means the password was refused before it could be
     * scored, and a caller may rely on that: a strength of null with no code is a state the API never
     * produces. Mapping an unexpected number to null would fabricate exactly that combination.
     * Throwing surfaces as a failed check, which callers already handle.
     */
    export const fromRaw = (input: unknown): PasswordStrength | null => {
        if (input === null || input === undefined) {
            return null;
        }
        if (input === 0 || input === 1 || input === 2 || input === 3 || input === 4) {
            return input;
        }
        throw new Error('Unable to parse PasswordStrength: expected 0-4 or null, got "' + String(input) + '"');
    }
}
