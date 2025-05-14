export class QueueStatus {
    public name: string;
    public state: 'nonexisting' | 'running';
    public vhost: string;

    public messages_ready: number = 0;
    public messages_handling: number = 0;

    public message_publish_rate: number = 0;
    public message_handling_rate: number = 0;

    public consumers: number = 0;

    public updated: Date;
}
