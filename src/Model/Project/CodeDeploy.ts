import {Utils} from '../../Utils.js';
import {CodeDeployStatus} from './CodeDeployStatus.js';
import {ProjectDeployCommit} from './ProjectDeployCommit.js';
import {ApiRecord} from '../ApiRecord.js';

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

    public static parse(rawCodeDeploy: ApiRecord): CodeDeploy {
        const projectDeploy: CodeDeploy = new CodeDeploy();

        projectDeploy.id = rawCodeDeploy.id as string;
        projectDeploy.codeSourceId = rawCodeDeploy.code_source as string;
        projectDeploy.platformId = rawCodeDeploy.platform as string;
        projectDeploy.buildStrategyId = rawCodeDeploy.build_strategy as string;
        projectDeploy.userId = rawCodeDeploy.user as string;
        projectDeploy.requested = Utils.parseRawDate(rawCodeDeploy.requested as Date);
        projectDeploy.started = rawCodeDeploy.started === null ? null : Utils.parseRawDate(rawCodeDeploy.started as Date);
        projectDeploy.finished = rawCodeDeploy.finished === null ? null : Utils.parseRawDate(rawCodeDeploy.finished as Date);
        projectDeploy.status = CodeDeployStatus.fromString(rawCodeDeploy.status as string);
        projectDeploy.bytes = rawCodeDeploy.bytes === null ? null : Utils.parseInt(rawCodeDeploy.bytes as number);
        projectDeploy.path = rawCodeDeploy.path as string;
        projectDeploy.commitHash = rawCodeDeploy.commit_hash as string;

        const rawProjectDeployCommits: any[] = rawCodeDeploy.commits as unknown as any[];

        for (const rawProjectDeployCommit of rawProjectDeployCommits) {
            const projectDeployCommit: ProjectDeployCommit = new ProjectDeployCommit();
            projectDeployCommit.hash = rawProjectDeployCommit.commit_hash as string;
            projectDeployCommit.date = Utils.parseRawDate(rawProjectDeployCommit.commit_date);
            projectDeployCommit.message = rawProjectDeployCommit.commit_message as string;
            projectDeployCommit.authorName = rawProjectDeployCommit.commit_author_name as string;
            projectDeployCommit.authorEmail = rawProjectDeployCommit.commit_author_email as string;

            projectDeploy.commits.push(projectDeployCommit);
        }

        projectDeploy.errors = rawCodeDeploy.errors as { message: string }[] | null;

        return projectDeploy;
    }
}
