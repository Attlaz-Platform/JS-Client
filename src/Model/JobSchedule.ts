export class JobSchedule {
    public id: number;
    public job: number;
    public status: string;
    public forced: boolean;
    public created: Date;
    public scheduled: Date;
    public executed: Date;
    public finished: Date;
    public log: string;
}