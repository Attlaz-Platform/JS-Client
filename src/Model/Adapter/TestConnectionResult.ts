/**
 * Result of `AdapterConnectionEndpoint.testConnection()`.
 *
 * Mirrors the shape produced by Services-Api's `ConnectionTestController`. The
 * server derives `state` mechanically (worst of all `checks` entries: skipped <
 * passed < warning < failed) so consumers can treat it as authoritative for the
 * overall connection status.
 *
 * Kept as a local copy of the server shape; if a third consumer ever needs the
 * same type, lift it to Library/Core (see project plan).
 */
export type ConnectionTestState = 'passed' | 'warning' | 'failed' | 'skipped';

export interface TestConnectionCheck {
    /** User-visible label, e.g. "Reach Hue bridge" or "Configuration valid". */
    name: string;
    state: ConnectionTestState;
    /** Wall-clock duration of this check in ms. `0` for checks that never ran. */
    durationMs: number;
    /** Free-form additional info, e.g. "HTTP 200" or "Missing scope: playlist-read". */
    detail?: string;
}

export interface TestConnectionResult {
    state: ConnectionTestState;
    checks: TestConnectionCheck[];
    /** Top-level message when nothing meaningful ran (e.g. adapter unknown). */
    error?: string;
}

/**
 * Parser for the JSON payload returned by `POST /services/:id/test-connection`.
 * The server emits the shape directly (no envelope), so the parser is mostly
 * identity with a defensive default for missing fields.
 */
export function parseTestConnectionResult(raw: any): TestConnectionResult {
    return {
        state: (raw.state ?? 'skipped') as ConnectionTestState,
        checks: Array.isArray(raw.checks)
            ? raw.checks.map((c: any): TestConnectionCheck => ({
                name: String(c.name ?? ''),
                state: (c.state ?? 'skipped') as ConnectionTestState,
                durationMs: Number(c.duration_ms ?? c.durationMs ?? 0),
                ...(c.detail !== undefined && c.detail !== null ? {detail: String(c.detail)} : {}),
            }))
            : [],
        ...(raw.error !== undefined && raw.error !== null ? {error: String(raw.error)} : {}),
    };
}
