import {DataValueValue} from '../DataValue.js';
import {ApiRecord} from '../ApiRecord.js';

export class AdapterConfiguration {
    public id: string;
    public key: string;
    public type: string;
    public adapter: string;
    public name: string;
    public description: string;
    public default: DataValueValue | null;
    public validation: string[];

    public static parse(rawAdapterConfiguration: ApiRecord): AdapterConfiguration {
        const configuration: AdapterConfiguration = new AdapterConfiguration();
        configuration.id = rawAdapterConfiguration.id as string;
        configuration.key = rawAdapterConfiguration.key as string;
        configuration.type = rawAdapterConfiguration.type as string;
        configuration.adapter = rawAdapterConfiguration.adapter as string;
        configuration.name = rawAdapterConfiguration.name as string;
        configuration.description = rawAdapterConfiguration.description as string;
        configuration.default = rawAdapterConfiguration.default as DataValueValue | null;
        configuration.validation = rawAdapterConfiguration.validation as string[];
        return configuration;
    }
}
