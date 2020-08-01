export class Utils {
    public static isNullOrUndefined(variable: any): boolean {
        return variable === null || variable === undefined;
    }

    public static isTrue(input: string | number | boolean | null | undefined): boolean {
        return (input === true || input === 'true' || input === 1 || input === '1');
    }
    public static parseRawDate(input: Date): Date | null {
        if (input !== null && input !== undefined) {
            return new Date(input);
        }
        return null;
    }

    public static parseEnum<T>(input: string, Enum: any): T|null {

        if (this.isNullOrUndefined(input)) {
            return null;
        }
        for (const property in Enum) {
            const enumMember = Enum[property];
            if (typeof enumMember === 'string' || typeof enumMember === 'number') {
                if (enumMember.toString().toUpperCase() === input.toString().toUpperCase()) {
                    // const key = enumMember as string as keyof typeof Enum;
                    return Enum[property];
                }
            } else if (typeof enumMember === 'string') {
                console.error('Unable to parse enum type: ' + typeof enumMember + ' for enum ', Enum);
            }
        }
    }
    public static base64encode(input: string): string {
        return Buffer.from(input).toString('base64');
    }
}
