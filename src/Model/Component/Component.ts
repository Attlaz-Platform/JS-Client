import {State} from '../State.js';
import {ComponentKind} from './ComponentKind.js';
import {ComponentVersion} from './ComponentVersion.js';

/** One thing the platform builds and deploys: an api, a service, or the runner. */
export class Component {
    public id: string;
    public name: string;
    public kind: ComponentKind;

    /** Registry path without a tag, e.g. `registry.gitlab.com/attlaz/platform/message_service`. */
    public imageRepository: string;

    /**
     * The version that *should* be deployed — desired state, set by promoting. Null means the
     * component is not managed this way, never "deploy nothing".
     */
    public activeVersionId: string | null;

    /**
     * The active version itself, present only when requested with `?expand=active_version`.
     * Null both when nothing is promoted and when the caller did not ask for it — check
     * `activeVersionId` to tell those apart.
     */
    public activeVersion: ComponentVersion | null = null;

    public createdAt: Date;
    public updatedAt: Date;
    public state: State;
}
