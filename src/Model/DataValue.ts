export type DataValueValue = string | number | boolean;

export class DataValue {
    public key: string;
    public value: DataValueValue;

    public constructor(key: string, value: DataValueValue) {
        this.key = key;
        this.value = value;
    }
}
