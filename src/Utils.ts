export class Utils {
    public static isNullOrUndefined(variable: any): boolean {
        return variable === null || variable === undefined;
    }

    public static isTrue(input: string | number | boolean | null | undefined): boolean {
        return (input === true || input === 'true' || input === 1 || input === '1');
    }

    public static parseRawDate(input: Date): Date  {
        if (input !== null && input !== undefined) {
            return new Date(input);
        }
        throw new Error('Unable to parse date, null/undefined');
    }

    public static parseEnum<T>(input: string, Enum: any): T | null {

        if (this.isNullOrUndefined(input)) {
            return null;
        }
        // tslint:disable-next-line:forin
        for (const property in Enum) {
            // noinspection JSUnfilteredForInLoop
            const enumMember = Enum[property];
            if (typeof enumMember === 'string' || typeof enumMember === 'number') {
                if (enumMember.toString().toUpperCase() === input.toString().toUpperCase()) {
                    // const key = enumMember as string as keyof typeof Enum;
                    const res = Enum[property];
                    if (res === undefined) {
                        return null;
                    }
                    return res;
                }
            } else if (typeof enumMember === 'string') {
                console.error('Unable to parse enum type: ' + typeof enumMember + ' for enum ', Enum);
            }
        }
        return null;
    }

    public static base64encode(input: string): string {
        if (input === null || input === undefined || input === '') {
            return '';
        }
        return Buffer.from(input).toString('base64');
    }

    public static base64decode(encodedString: string): string {

        if (encodedString === null || encodedString === undefined || encodedString === '') {
            return '';
        }
        return Buffer.from(encodedString, 'base64').toString();
    }
}
