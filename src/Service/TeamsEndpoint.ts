import {Endpoint, Team} from "..";
import {State} from '../Model/State';

export class TeamsEndpoint extends Endpoint {

    public async getAll(): Promise<Team[]> {

        try {
            const rawTeams: any[] = await this.httpClient.request('/teams');
            let teams: Team[] = [];
            for (let rawTeam of rawTeams) {
                let team: Team = new Team();
                team.id = rawTeam.id;
                team.name = rawTeam.name;
                team.state = State.fromString(rawTeam.state);
                team.default = rawTeam.default;
                teams.push(team);
            }

            return teams;
        } catch (e) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load teams: ' + e);
            }

            throw e;
        }

    }

}
