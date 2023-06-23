export abstract class JsonSerializable {
    public static stringify(object: any): string {
        const replacer = (key: string, value: any) => {
            // Filtering out properties
            if (value instanceof JsonSerializable && 'jsonSerialize' in value) {
                return value.jsonSerialize();
            }
            return value;
        };

        return JSON.stringify(object, replacer);
    }

    abstract jsonSerialize(): any;
}
