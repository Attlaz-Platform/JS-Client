import {ApiRecord} from '../ApiRecord.js';
import {DataValueValue} from '../DataValue.js';
import {State} from '../State.js';

export class Configuration {
    public id: string;
    public path: string;
    public value: DataValueValue;
    public state: State;
    public scope: string;

    public static parse(rawConfig: ApiRecord): Configuration {
        const config: Configuration = new Configuration();
        config.id = rawConfig.id as string;
        config.path = rawConfig.path as string;
        config.value = rawConfig.value as DataValueValue;
        config.state = State.fromString(rawConfig.state as string);
        config.scope = rawConfig.scope as string;
        return config;
    }
}
