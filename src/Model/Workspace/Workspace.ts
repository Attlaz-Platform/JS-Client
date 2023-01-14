import {State} from '../State';
import {StateAware} from '../StateAware';

export class Workspace implements StateAware {
    id: string;
    name: string;
    state: State;

    public static parse(rawTeam: any): Workspace {
        const team: Workspace = new Workspace();
        team.id = rawTeam.id;
        team.name = rawTeam.name;
        team.state = State.fromString(rawTeam.state);

        return team;
    }
}
