import {State} from '../State';
import {StateAware} from '../StateAware';

export class Team implements StateAware {
    id: string;
    name: string;
    state: State;

    public static parse(rawTeam: any): Team {
        const team: Team = new Team();
        team.id = rawTeam.id;
        team.name = rawTeam.name;
        team.state = State.fromString(rawTeam.state);

        return team;
    }
}
