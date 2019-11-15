import {ProjectDeployStatus} from './ProjectDeployStatus';
import {ParseHelper} from '../../Helper/ParseHelper';
import {ProjectDeployCommit} from './ProjectDeployCommit';

export class ProjectDeploy {
    public id: number;
    public projectEnvironmentId: number;
    public userId: number;
    public requested: Date;
    public started: Date;
    public finished: Date;
    public status: ProjectDeployStatus = ProjectDeployStatus.Unknown;

    public bytes: number;

    public commit_hash: string;
    public commits: ProjectDeployCommit[] = [];

    public static parse(rawProjectDeploy: any): ProjectDeploy {
        const projectDeploy: ProjectDeploy = new ProjectDeploy();

        projectDeploy.id = rawProjectDeploy.id;
        projectDeploy.projectEnvironmentId = rawProjectDeploy.projectEnvironmentId;
        projectDeploy.userId = rawProjectDeploy.userId;
        projectDeploy.requested = rawProjectDeploy.requested;
        projectDeploy.started = new Date(rawProjectDeploy.started);
        projectDeploy.finished = new Date(rawProjectDeploy.finished);
        projectDeploy.status = ProjectDeployStatus.fromString(rawProjectDeploy.status);

        if (!ParseHelper.isNullOrUndefined(rawProjectDeploy.bytes)) {
            projectDeploy.bytes = parseInt(rawProjectDeploy.bytes);
        }
        projectDeploy.commit_hash = rawProjectDeploy.commit_hash;

        const rawProjectDeployCommits: any[] = rawProjectDeploy.commits;

        for (let rawProjectDeployCommit of rawProjectDeployCommits) {
            let projectDeployCommit: ProjectDeployCommit = new ProjectDeployCommit();
            projectDeployCommit.commit_hash = rawProjectDeployCommit.commit_hash;
            projectDeployCommit.commit_date = new Date(rawProjectDeployCommit.commit_date);
            projectDeployCommit.commit_message = rawProjectDeployCommit.commit_message;
            projectDeployCommit.commit_author_name = rawProjectDeployCommit.commit_author_name;
            projectDeployCommit.commit_author_email = rawProjectDeployCommit.commit_author_email;

            projectDeploy.commits.push(projectDeployCommit);
        }
        
        return projectDeploy;
    }
}
