import {Utils} from '../Utils.js';
import {State} from './State.js';
import {ApiRecord} from './ApiRecord.js';

/**
 * @deprecated
 */
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

    public static parse(rawConfig: ApiRecord): Config {
        const config: Config = new Config();
        config.id = rawConfig.id as number;
        config.projectId = rawConfig.project as string;
        config.projectEnvironmentId = rawConfig.project_environment as string;
        config.flowId = rawConfig.flow as string;
        config.scope = rawConfig.scope as string;
        config.key = rawConfig.key as string;
        config.value = rawConfig.value as string;
        config.inheritable = Utils.isTrue(rawConfig.inheritable as string | number | boolean | null);
        config.sensitive = Utils.isTrue(rawConfig.sensitive as string | number | boolean | null);
        config.state = State.fromString(rawConfig.state as string);

        return config;
    }
}
