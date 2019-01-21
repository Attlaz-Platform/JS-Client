import {State} from './State';

export class Config {
    public id: number;
    public project: string;
    public task: string;
    public scope: string;
    public key: string;
    public value: string;
    public state: State = State.Active;

    public static parse(rawConfig: any): Config {
        let config: Config = new Config();
        config.id = rawConfig.id;
        config.project = rawConfig.project;
        config.task = rawConfig.task;
        config.scope = rawConfig.scope;
        config.key = rawConfig.key;
        config.value = rawConfig.value;
        config.state = State.fromString(rawConfig.state);

        return config;
    }
}
