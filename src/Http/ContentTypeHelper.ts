export class ContentTypeHelper {


    public static formatContentType(input: string): { type: string, options: string | null } {
        const arrInput: string[] = input.split(';');
        if (arrInput.length === 1) {
            return {type: arrInput[0], options: null};
        }
        if (arrInput.length === 2) {
            return {type: arrInput[0], options: arrInput[1].trim()};
        }
        console.error('Unable to parse content type "' + input + '"');
        return {type: input, options: null};
    }
}
