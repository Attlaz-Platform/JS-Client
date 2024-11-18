import {Utils} from '../Utils.js';
import {State} from './State.js';

export class Config {
    public id: number;
    public projectId: string;
    public projectEnvironmentId: string;
    public flowId: string;
    public scope: string;
    public key: string;
    public value: string;
    public inheritable: boolean = true;
    public sensitive: boolean = true;
    public state: State = State.Active;

    public static parse(rawConfig: Record<string, any>): Config {
        const config: Config = new Config();
        config.id = rawConfig.id;
        config.projectId = rawConfig.project;
        config.projectEnvironmentId = rawConfig.project_environment;
        config.flowId = rawConfig.flow;
        config.scope = rawConfig.scope;
        config.key = rawConfig.key;
        config.value = rawConfig.value;
        config.inheritable = Utils.isTrue(rawConfig.inheritable);
        config.sensitive = Utils.isTrue(rawConfig.sensitive);
        config.state = State.fromString(rawConfig.state);

        return config;
    }
}
