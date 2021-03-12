import {State} from './State';
import {Utils} from '../Utils';

export class Config {
    public id: number;
    public project: string;
    public projectEnvironment: string;
    public task: string;
    public scope: string;
    public key: string;
    public value: string;
    public inheritable: boolean = true;
    public sensitive: boolean = true;
    public state: State = State.Active;

    public static parse(rawConfig: any): Config {
        let config: Config = new Config();
        config.id = rawConfig.id;
        config.project = rawConfig.project;
        config.projectEnvironment = rawConfig.projectEnvironment;
        config.task = rawConfig.task;
        config.scope = rawConfig.scope;
        config.key = rawConfig.key;
        config.value = rawConfig.value;
        config.inheritable = Utils.isTrue(rawConfig.inheritable);
        config.sensitive = Utils.isTrue(rawConfig.sensitive);
        config.state = State.fromString(rawConfig.state);

        return config;
    }
}
