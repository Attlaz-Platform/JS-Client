import {ProjectDeployStatus} from './ProjectDeployStatus';
import {ProjectDeployCommit} from './ProjectDeployCommit';
import {Utils} from '../../Utils';

export class ProjectDeploy {
    public id: string;
    public platformId: string;
    public buildStrategyId: string;
    public userId: string;
    public requested: Date;
    public started: Date | null = null;
    public finished: Date | null = null;
    public status: ProjectDeployStatus = ProjectDeployStatus.Unknown;
    public bytes: number | null = null;
    public commits: ProjectDeployCommit[] = [];
    public path: string | null = null;
    public commitHash: string | null = null;
    public errors: { message: string }[] | null = null;

    public static parse(rawProjectDeploy: any): ProjectDeploy {
        const projectDeploy: ProjectDeploy = new ProjectDeploy();

        projectDeploy.id = rawProjectDeploy.id.toString();
        projectDeploy.platformId = rawProjectDeploy.platform;
        projectDeploy.buildStrategyId = rawProjectDeploy.build_strategy;
        projectDeploy.userId = rawProjectDeploy.user;
        projectDeploy.requested = Utils.parseRawDate(rawProjectDeploy.requested);
        projectDeploy.started = rawProjectDeploy.started === null ? null : Utils.parseRawDate(rawProjectDeploy.started);
        projectDeploy.finished = rawProjectDeploy.finished === null ? null : Utils.parseRawDate(rawProjectDeploy.finished);
        projectDeploy.status = ProjectDeployStatus.fromString(rawProjectDeploy.status);
        projectDeploy.bytes = rawProjectDeploy.bytes === null ? null : parseInt(rawProjectDeploy.bytes);
        projectDeploy.path = rawProjectDeploy.path;
        projectDeploy.commitHash = rawProjectDeploy.commit_hash;

        const rawProjectDeployCommits: any[] = rawProjectDeploy.commits;

        for (let rawProjectDeployCommit of rawProjectDeployCommits) {
            let projectDeployCommit: ProjectDeployCommit = new ProjectDeployCommit();
            projectDeployCommit.hash = rawProjectDeployCommit.commit_hash;
            projectDeployCommit.date = Utils.parseRawDate(rawProjectDeployCommit.commit_date);
            projectDeployCommit.message = rawProjectDeployCommit.commit_message;
            projectDeployCommit.authorName = rawProjectDeployCommit.commit_author_name;
            projectDeployCommit.authorEmail = rawProjectDeployCommit.commit_author_email;

            projectDeploy.commits.push(projectDeployCommit);
        }

        projectDeploy.errors = rawProjectDeploy.errors;

        return projectDeploy;
    }
}
