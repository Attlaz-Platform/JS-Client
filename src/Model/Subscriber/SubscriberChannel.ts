export class SubscriberChannel {
    public id: number;
    public team: string;
    public label: string;
    public type: string;
    public data: any;

    public constructor(id: number, team: string, label: string, type: string, data: any) {
        this.id = id;
        this.team = team;
        this.label = label;
        this.type = type;
        this.data = data;
    }

}