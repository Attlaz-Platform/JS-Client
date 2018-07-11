export class Adapter {
    public id: string;
    public name: string;
    public description: string;
    public vendor: string;
    public image: string;
    public type: string;


    public static parse(rawAdapter: any): Adapter {
        return rawAdapter;
    }
}