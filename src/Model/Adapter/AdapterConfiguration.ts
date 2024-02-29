import {DataValueValue} from '../DataValue.js';

export class AdapterConfiguration {
    public id: string;
    public key: string;
    public type: string;
    public adapter: string;
    public name: string;
    public description: string;
    public default: DataValueValue | null;
    public validation: string | null = null;

    public static parse(rawAdapterConfiguration: any): AdapterConfiguration {
        const configuration: AdapterConfiguration = new AdapterConfiguration();
        configuration.id = rawAdapterConfiguration.id;
        configuration.key = rawAdapterConfiguration.key;
        configuration.type = rawAdapterConfiguration.type;
        configuration.adapter = rawAdapterConfiguration.adapter;
        configuration.name = rawAdapterConfiguration.name;
        configuration.description = rawAdapterConfiguration.description;
        configuration.default = rawAdapterConfiguration.default;
        configuration.validation = rawAdapterConfiguration.validation;
        return configuration;
    }
}
