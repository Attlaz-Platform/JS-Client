import {DataValueCollection} from '../DataValueCollection.js';

export class UserAction {
    public id: string;
    public userId: string;
    public workspaceId: string;
    public action: string;
    public entityId: string;
    public entityType: string;
    public description: string;
    public ip: string;
    public time: Date;
    public result: string;
    public data: DataValueCollection;
}
