export class RunnersStatus {
    public state: 'nonexisting' | 'running';

    public total: number;
    public running: number;
    public down: number;

    public memory_limit: number | null;
    public cpu_limit: number | null;

    public date: Date;
}
