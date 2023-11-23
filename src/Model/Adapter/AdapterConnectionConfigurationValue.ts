import {DataValueValue} from '../DataValue.js';
import {DataValueCollection} from '../DataValueCollection.js';

export class AdapterConnectionConfigurationValue {
    public id: string;
    public config_id: string;
    public config_key: string;
    public value: DataValueValue | null;

    public static toDataValueCollection(configurationValues: AdapterConnectionConfigurationValue[]): DataValueCollection {
        const result: DataValueCollection = new DataValueCollection();
        for (const configurationValue of configurationValues) {
            if (configurationValue.value !== null) {
                result.set(configurationValue.config_key, configurationValue.value);
            }
        }
        return result;
    }
}
