export class Config {
    public id: string;
    public branch: string;
    public task: string;
    public scope: string;
    public key: string;
    public value: string;

    public static parse(rawConfig: any): Config {
        let config: Config = new Config();
        config.id = rawConfig.id;
        config.branch = rawConfig.branch;
        config.task = rawConfig.task;
        config.scope = rawConfig.scope;
        config.key = rawConfig.key;
        config.value = rawConfig.value

        return config;
    }
}
