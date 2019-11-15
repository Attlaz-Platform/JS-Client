export abstract class ChannelData {

    public type: string;

    public constructor(type: string) {
        this.type = type;
    }

    public toString(): string {
        return JSON.stringify(this);
    }
}
