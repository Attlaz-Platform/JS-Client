export class ParseHelper {
    public static parseRawDate(input: Date): Date | null {
        if (input !== null && input !== undefined) {
            return new Date(input);
        }
        return null;
    }

    public static parseEnum<T>(input: string, Enum: any): T {

        const Enum2: { [idx: string]: T; } = <any>Enum;
        const enumVal: T = Enum2[input];

        return enumVal as T;
    }

    public static parseBoolean(input: string | number | boolean | null | undefined): boolean {
        return (input === true || input === 'true' || input === 1 || input === '1');
    }

    public static isNullOrUndefined(variable: any): boolean {
        return variable === null || variable === undefined;
    }

}
