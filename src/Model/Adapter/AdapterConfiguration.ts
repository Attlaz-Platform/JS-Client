export class AdapterConfiguration {
    public id: string;
    public key: string;
    public type: string;
    public adapter: string;
    public name: string;
    public description: string;

    public static parse(rawAdapter: any): AdapterConfiguration {
        let configuration: AdapterConfiguration = new AdapterConfiguration();
        configuration.id = rawAdapter.id;
        configuration.key = rawAdapter.key;
        configuration.type = rawAdapter.type;
        configuration.adapter = rawAdapter.adapter;
        configuration.name = rawAdapter.name;
        configuration.description = rawAdapter.description;

        return configuration;

    }
}
