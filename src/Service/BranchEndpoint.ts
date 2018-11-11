import {Branch, Endpoint} from "..";

export class BranchEndpoint extends Endpoint {

    public getAll(): Promise<Branch[]> {
        return new Promise<Branch[]>((resolve, reject) => {
            this.httpClient.request('branches').then((rawBranches: any) => {

                let branches: Branch[] = [];
                for (let rawBranch of rawBranches) {
                    branches.push(Branch.parse(rawBranch));
                }

                resolve(branches);
            }).catch((reason) => {
                if (this.httpClient.isDebugEnabled()) {
                    console.error('Failed to load branches: ' + reason);
                }

                reject(reason);
            });
        });

    }

    public getByTeam(teamId: string): Promise<Branch[]> {
        return new Promise<Branch[]>((resolve, reject) => {
            this.httpClient.request('teams/' + teamId + '/branches').then((rawBranches: any) => {

                let branches: Branch[] = [];
                for (let rawBranch of rawBranches) {
                    branches.push(Branch.parse(rawBranch));
                }

                resolve(branches);
            }).catch((reason) => {
                if (this.httpClient.isDebugEnabled()) {
                    console.error('Failed to load branches: ' + reason);
                }

                reject(reason);
            });
        });

    }
}