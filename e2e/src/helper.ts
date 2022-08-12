export class Helper {
    public static getEnvValue(key: string): string {
        const value: string | undefined = process.env[key];
        if (value === null || value === undefined || value === '') {
            throw new Error('Env value for "' + key + '" not defined');
        }
        return value;
    }
}
