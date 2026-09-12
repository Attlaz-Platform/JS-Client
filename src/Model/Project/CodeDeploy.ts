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

    /** The deliverable — the archive today, possibly an image later. */
    public artifactChecksum: string | null = null;
    public artifactFormat: string | null = null;
    public artifactSize: number | null = null;
    /** Null while the artifact is still served; set once it is withdrawn. */
    public artifactRetiredAt: Date | null = null;

    /** The built directory the artifact was made from. */
    public buildChecksum: string | null = null;
    public buildSize: number | null = null;



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

        projectDeploy.artifactChecksum = rawCodeDeploy.artifact_checksum as string | null;
        projectDeploy.artifactFormat = rawCodeDeploy.artifact_format as string | null;
        const rawArtifactSize: unknown = rawCodeDeploy.artifact_size;
        projectDeploy.artifactSize = rawArtifactSize === null || rawArtifactSize === undefined ? null : Utils.parseInt(rawArtifactSize as number);
        projectDeploy.artifactRetiredAt = rawCodeDeploy.artifact_retired_at === null || rawCodeDeploy.artifact_retired_at === undefined ? null : new Date(rawCodeDeploy.artifact_retired_at as string);

        projectDeploy.buildChecksum = rawCodeDeploy.build_checksum as string | null;
        const rawBuildSize: unknown = rawCodeDeploy.build_size;
        projectDeploy.buildSize = rawBuildSize === null || rawBuildSize === undefined ? null : Utils.parseInt(rawBuildSize as number);



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
