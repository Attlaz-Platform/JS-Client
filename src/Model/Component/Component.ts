import {State} from '../State.js';
import {ComponentKind} from './ComponentKind.js';

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

    public createdAt: Date;
    public updatedAt: Date;
    public state: State;
}
