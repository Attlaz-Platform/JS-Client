import {CodeDeployStatus} from './CodeDeployStatus.js';
import {ProjectDeployCommit} from './ProjectDeployCommit.js';
import {Utils} from '../../Utils.js';

export class CodeDeploy {
    public id: string;
    public codeSourceId: string;
    public platformId: string;
    public buildStrategyId: string;
    public userId: string;
    public requested: Date;
    public started: Date | null = null;
    public finished: Date | null = null;
    public status: CodeDeployStatus = CodeDeployStatus.Unknown;
    public bytes: number | null = null;
    public commits: ProjectDeployCommit[] = [];
    public path: string | null = null;
    public commitHash: string | null = null;
    public errors: { message: string }[] | null = null;

    public static parse(rawCodeDeploy: any): CodeDeploy {
        const projectDeploy: CodeDeploy = new CodeDeploy();

        projectDeploy.id = rawCodeDeploy.id.toString();
        projectDeploy.codeSourceId = rawCodeDeploy.code_source;
        projectDeploy.platformId = rawCodeDeploy.platform;
        projectDeploy.buildStrategyId = rawCodeDeploy.build_strategy;
        projectDeploy.userId = rawCodeDeploy.user;
        projectDeploy.requested = Utils.parseRawDate(rawCodeDeploy.requested);
        projectDeploy.started = rawCodeDeploy.started === null ? null : Utils.parseRawDate(rawCodeDeploy.started);
        projectDeploy.finished = rawCodeDeploy.finished === null ? null : Utils.parseRawDate(rawCodeDeploy.finished);
        projectDeploy.status = CodeDeployStatus.fromString(rawCodeDeploy.status);
        projectDeploy.bytes = rawCodeDeploy.bytes === null ? null : Utils.parseInt(rawCodeDeploy.bytes);
        projectDeploy.path = rawCodeDeploy.path;
        projectDeploy.commitHash = rawCodeDeploy.commit_hash;

        const rawProjectDeployCommits: any[] = rawCodeDeploy.commits;

        for (const rawProjectDeployCommit of rawProjectDeployCommits) {
            const projectDeployCommit: ProjectDeployCommit = new ProjectDeployCommit();
            projectDeployCommit.hash = rawProjectDeployCommit.commit_hash;
            projectDeployCommit.date = Utils.parseRawDate(rawProjectDeployCommit.commit_date);
            projectDeployCommit.message = rawProjectDeployCommit.commit_message;
            projectDeployCommit.authorName = rawProjectDeployCommit.commit_author_name;
            projectDeployCommit.authorEmail = rawProjectDeployCommit.commit_author_email;

            projectDeploy.commits.push(projectDeployCommit);
        }

        projectDeploy.errors = rawCodeDeploy.errors;

        return projectDeploy;
    }
}
