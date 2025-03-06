import {State} from '../State.js';
import {StateAware} from '../StateAware.js';

export class UserNotificationSession implements StateAware {
    public id: string;
    public session: string;
    public subscription: unknown;

    public createdAt: Date;
    public updatedAt: Date;
    public expiresAt: Date;

    public state: State;
    public os: string;
    public browser: string;
}
