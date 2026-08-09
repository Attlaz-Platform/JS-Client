import {State} from '../State.js';

/** One tag of a component as the container registry has it. */
export class ComponentVersion {
    public id: string;
    public componentId: string;

    /** The registry tag, e.g. `1.15.1`. */
    public version: string;

    /** Fully-qualified reference including the tag. */
    public image: string;

    /**
     * When the image was published to the registry and became available to select. Not a build time,
     * and not evidence it was ever deployed — most versions never are.
     */
    public releasedAt: Date;

    public state: State;
}
