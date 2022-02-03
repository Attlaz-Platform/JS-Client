import {State} from '../State';
import {StateAware} from '../StateAware';

export class Team implements StateAware{
    id: string;
    name: string;
    state: State;
}
