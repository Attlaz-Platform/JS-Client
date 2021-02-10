import {State} from '../State';

export class TeamInvite {
    public email: string;
    public owner: number;
    public date: Date;
    public state: State = State.Active;

}
