export class Notification {
    public id: number;
    public userId: number;
    public type: string;
    public subject: string;
    public body: string;
    public time: Date;
    public acknowledged: boolean = false;
}
