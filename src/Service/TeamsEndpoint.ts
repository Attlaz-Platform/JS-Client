import {Endpoint, Team} from "..";

export class TeamsEndpoint extends Endpoint {

    public getAll(): Promise<Team[]> {
        return new Promise<Team[]>((resolve, reject) => {
            this.httpClient.request('/teams').then((rawTeams: any[]) => {
                let teams: Team[] = [];
                for (let rawTeam of rawTeams) {
                    let team: Team = new Team();
                    team.id = rawTeam.id;
                    team.name = rawTeam.name;
                    team.default = rawTeam.default;
                    teams.push(team);
                }
                rawTeams = null;
                resolve(teams);
            }).catch((reason) => {
                if (this.httpClient.isDebugEnabled()) {
                    console.error('Failed to load teams: ' + reason);
                }

                reject(reason);
            });
        });

    }

}