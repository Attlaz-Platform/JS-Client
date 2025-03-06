import {Utils} from '../Utils.js';
import {DataValue, DataValueValue} from './DataValue.js';
import {JsonSerializable} from './JsonSerializable.js';

export class DataValueCollection extends JsonSerializable implements Iterable<DataValue> {
    private _values: DataValue[] = [];

    public get length(): number {
        return this._values.length;
    }

    public static fromObject(rawValues: { key: string, value: DataValueValue }[] | null): DataValueCollection {
        if (rawValues === null || rawValues === undefined) {
            return new DataValueCollection();
        }
        if (!Utils.isIterable(rawValues)) {
            throw new Error('Raw values is not iterable: ' + JSON.stringify(rawValues));
        }

        const result: DataValueCollection = new DataValueCollection();
        for (const rawValue of rawValues) {
            // TODO: validate rawTag
            result.set(rawValue.key, rawValue.value);
        }

        return result;
    }

    public set(key: string, value: DataValueValue): void {
        const existingIndex = this._values.findIndex((tag: DataValue) => tag.key === key);
        if (existingIndex !== -1) {
            this._values.splice(existingIndex);
        }
        this._values.push(new DataValue(key, value));
    }

    public has(key: string): boolean {
        for (const tag of this._values) {
            if (tag.key === key) {
                return true;
            }
        }
        return false;
    }

    public get(key: string): DataValueValue | null {
        for (const tag of this._values) {
            if (tag.key === key) {
                return tag.value;
            }
        }
        return null;
    }

    public unset(key: string): void {
        this._values = this._values.filter((tag: DataValue) => tag.key !== key);
    }

    public serialize(): string | null {
        if (this._values.length === 0) {
            return null;
        }
        return JSON.stringify(this._values);
    }

    [Symbol.iterator](): Iterator<DataValue> {
        return this._values.values();
    }

    public jsonSerialize(): any {
        return this._values;
    }
}
