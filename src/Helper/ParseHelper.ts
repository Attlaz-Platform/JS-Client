export class ParseHelper {
    public static parseRawDate(input: Date): Date | null {
        if (input !== null && input !== undefined) {
            return new Date(input);
        }
        return null;
    }
}
