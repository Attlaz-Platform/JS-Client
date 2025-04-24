import {State} from '../State.js';
import {DataValueValue} from '../DataValue.js';

export class Configuration {
    public id: string;
    public path: string;
    public value: DataValueValue;
    public state: State;
    public scope: string;

    public static parse(rawConfig: Record<string, unknown>): Configuration {
        const config: Configuration = new Configuration();
        config.id = rawConfig.id as string;
        config.path = rawConfig.path as string;
        config.value = rawConfig.value as DataValueValue;
        config.state = State.fromString(rawConfig.state as string);
        config.scope = rawConfig.scope as string;
        return config;
    }
}
