import {Utils} from '../Utils.js';

export enum EntityType {
    Workspace = 'workspace',
    Project = 'project',
    ProjectEnvironment = 'project-environment',

    Flow = 'flow',
    FlowRun = 'flow-run',

    User = 'user',
    WorkspaceMember = 'workspace-member',

    Adapter = 'adapter',
    AdapterConnection = 'adapter-connection',

    Trigger = 'trigger',
    Channel = 'channel',
    ChannelSubscriber = 'channel-subscriber',
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
