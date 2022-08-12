export class TaskExecutionStats {

    public taskExecution: string;

    public time: Date;

    public memory: number | null = null;
    public memoryLimit: number | null = null;

    public cpu: number | null = null;
    public cpuLimit: number | null = null;

    public networkOutbound: number | null = null;
    public networkInbound: number | null = null;

    public fileRead: number | null = null;
    public fileWrite: number | null = null;
}
