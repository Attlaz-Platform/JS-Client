export class Config {
    public id: string;
    public branch: string;
    public task: string;
    public scope: string;
    public key: string;
    public value: string;

    public static parse(rawConfig: any): Config {
        return (rawConfig as Config);
    }
}
