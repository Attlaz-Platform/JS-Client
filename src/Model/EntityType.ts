import {Utils} from '../Utils.js';

export enum EntityType {
    Organisation = 'organisation',

    Workspace = 'workspace',
    Project = 'project',
    ProjectEnvironment = 'project-environment',

    Flow = 'flow',
    FlowRun = 'flow-run',

    User = 'user',
    UserAuthProvider = 'user-auth-provider',
    WorkspaceMember = 'workspace-member',

    Adapter = 'adapter',
    AdapterConnection = 'adapter-connection',

    Trigger = 'trigger',
    Channel = 'channel',
    ChannelSubscriber = 'channel-subscriber',

    CodeSourceAccount = 'code-source-account',
    CodeSource = 'code-source',
    CodeSourceDeploy = 'code-source-deploy',

    StorageBucket = 'storage-bucket',
    LogStream = 'log-stream',
}

export namespace EntityType {
    export const fromString = (input: string): EntityType => {
        const result: EntityType | null = Utils.parseEnum<EntityType>(input, EntityType);
        if (result === null) {
            throw new Error('Unable to parse EntityType from string: Unknown EntityType "' + input + '"');
        }
        return result;
    }
}
