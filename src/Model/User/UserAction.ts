import {DataValueCollection} from '../DataValueCollection';

export class UserAction {
    public id: string;
    public userId: string;
    public teamId: string;
    public action: string;
    public resourceId: string;
    public resourceType: string;
    public description: string;
    public ip: string;
    public time: Date;
    public result: string;
    public data: DataValueCollection;


}
