import {StateAware} from '../StateAware.js';
import {State} from '../State.js';

export class RunnerImage implements StateAware {
    public id: string;
    public name: string;
    public image: string;
    public version: string;
    public buildDate: Date;
    public deprecated: boolean = false;
    public endOfSupport: Date | null = null;
    public endOfLife: Date | null = null;
    public state: State = State.Active;
}
