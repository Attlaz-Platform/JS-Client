import {Utils} from '../../Utils.js';
import {ApiRecord} from '../ApiRecord.js';
import {CodeDeployStatus} from './CodeDeployStatus.js';
import {ProjectDeployCommit} from './ProjectDeployCommit.js';

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

    public archiveChecksum: string | null = null;
    public archiveType: string | null = null;
    public archiveSize: number | null = null;

    public checksum: string | null = null;
    public size: number | null = null;

    public storageBucketId: string | null = null;
    public storageItemId: string | null = null;

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

        projectDeploy.archiveChecksum = rawCodeDeploy.archive_checksum as string | null;
        projectDeploy.archiveType = rawCodeDeploy.archive_type as string | null;
        projectDeploy.archiveSize = rawCodeDeploy.archive_size === null ? null : Utils.parseInt(rawCodeDeploy.archive_size as number);

        projectDeploy.checksum = rawCodeDeploy.checksum as string | null;
        projectDeploy.size = rawCodeDeploy.size === null ? null : Utils.parseInt(rawCodeDeploy.size as number);

        projectDeploy.storageBucketId = rawCodeDeploy.storage_bucket as string | null;
        projectDeploy.storageItemId = rawCodeDeploy.storage_item as string | null;

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
