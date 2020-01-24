export class SubscriberChannel {
    public id: number;
    public owner: number;
    public label: string;
    public type: string;
    public data: any;
    public private: boolean = false;

    public constructor(id: number, owner: number, label: string, type: string, data: any) {
        this.id = id;
        this.owner = owner;
        this.label = label;
        this.type = type;
        this.data = data;
    }

}