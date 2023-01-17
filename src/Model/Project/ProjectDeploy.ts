import {ProjectDeployStatus} from './ProjectDeployStatus';
import {ProjectDeployCommit} from './ProjectDeployCommit';

export class ProjectDeploy {
    public id: string;
    public platformId: string;
    public buildStrategyId: string;
    public userId: string;
    public requested: Date;
    public started: Date;
    public finished: Date;
    public status: ProjectDeployStatus = ProjectDeployStatus.Unknown;
    public bytes: number;
    public commits: ProjectDeployCommit[] = [];
    public path: string;
    public commitHash: string;
    public errors: { message: string }[] | null = null;

    public static parse(rawProjectDeploy: any): ProjectDeploy {
        const projectDeploy: ProjectDeploy = new ProjectDeploy();

        projectDeploy.id = rawProjectDeploy.id.toString();
        projectDeploy.platformId = rawProjectDeploy.platform;
        projectDeploy.buildStrategyId = rawProjectDeploy.build_strategy;
        projectDeploy.userId = rawProjectDeploy.user;
        projectDeploy.requested = new Date(rawProjectDeploy.requested);
        projectDeploy.started = new Date(rawProjectDeploy.started);
        projectDeploy.finished = new Date(rawProjectDeploy.finished);
        projectDeploy.status = ProjectDeployStatus.fromString(rawProjectDeploy.status);
        projectDeploy.bytes = parseInt(rawProjectDeploy.bytes);
        projectDeploy.path = rawProjectDeploy.path;
        projectDeploy.commitHash = rawProjectDeploy.commit_hash;

        const rawProjectDeployCommits: any[] = rawProjectDeploy.commits;

        for (let rawProjectDeployCommit of rawProjectDeployCommits) {
            let projectDeployCommit: ProjectDeployCommit = new ProjectDeployCommit();
            projectDeployCommit.hash = rawProjectDeployCommit.commit_hash;
            projectDeployCommit.date = new Date(rawProjectDeployCommit.commit_date);
            projectDeployCommit.message = rawProjectDeployCommit.commit_message;
            projectDeployCommit.authorName = rawProjectDeployCommit.commit_author_name;
            projectDeployCommit.authorEmail = rawProjectDeployCommit.commit_author_email;

            projectDeploy.commits.push(projectDeployCommit);
        }

        projectDeploy.errors = rawProjectDeploy.errors;

        return projectDeploy;
    }
}
