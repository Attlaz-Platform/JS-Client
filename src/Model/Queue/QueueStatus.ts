export class QueueStatus {
    public name: string;

    public messages_ready: number = 0;
    public messages_handling: number = 0;
    public consumers: number = 0;

    public message_publish_rate: number = 0;
    public message_deliver_rate: number = 0;

    constructor(name: string) {
        this.name = name;
    }

    public static parse(raw: any): QueueStatus {
        const queue: QueueStatus = new QueueStatus(raw.name);
        queue.messages_ready = raw.messages_ready;
        queue.messages_handling = raw.messages_handling;
        queue.consumers = raw.consumers;

        queue.message_publish_rate = raw.message_publish_rate;
        queue.message_deliver_rate = raw.message_deliver_rate;

        return queue;
    }
}
