import {Utils} from '../../Utils.js';
import {ApiRecord} from '../ApiRecord.js';
import {State} from '../State.js';
import {StateAware} from '../StateAware.js';

/**
 * A named, revocable share of one connection or connection bundle, reachable at its own MCP URL.
 *
 * `target` is a type-prefixed id (`adc_…` for a connection, `cbl_…` for a bundle) and is write-once:
 * re-pointing an access would let a token already bound to its URL reach somewhere else.
 */
export class McpAccess implements StateAware {
    public id: string;
    public name: string;
    public target: string;
    public state: State = State.Active;
    public revokedAt: Date | null = null;
    public createdAt: Date;

    /**
     * The full URL to hand to a client, or null when the access has no live key — the state an
     * interrupted rotation leaves behind, which the UI has to be able to show rather than assume away.
     */
    public url: string | null = null;

    /**
     * Build the `target` for a connection or a bundle.
     *
     * The API addresses a target by one type-prefixed id, while every other client model carries the
     * bare one — so the prefix is added here rather than at each call site. Each literal is Core's
     * `PREFIX` (`adc`, `cbl`) plus the `_` separator its `toPrefixedString()` uses, duplicated the way
     * this package already duplicates enums; keep them in step.
     */
    public static targetForConnection(connectionId: string): string {
        return 'adc_' + connectionId;
    }

    public static targetForBundle(bundleId: string): string {
        return 'cbl_' + bundleId;
    }

    /** Paused is reversible and keeps its tokens; revoked is final and sweeps them. */
    public isUsable(): boolean {
        return this.revokedAt === null && this.state === State.Active && this.url !== null;
    }

    public static parse(raw: ApiRecord): McpAccess {
        const access: McpAccess = new McpAccess();
        access.id = raw.id as string;
        access.name = raw.name as string;
        access.target = raw.target as string;
        access.state = State.fromString(raw.state as string);
        access.revokedAt = (raw.revoked_at === null || raw.revoked_at === undefined) ? null : Utils.parseRawDate(raw.revoked_at as Date);
        access.createdAt = Utils.parseRawDate(raw.created_at as Date);
        access.url = (raw.url === null || raw.url === undefined) ? null : raw.url as string;
        return access;
    }
}
