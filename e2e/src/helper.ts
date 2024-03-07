export class Helper {
    public static getEnvValue(key: string): string {
        // TODO: maybe we can store this all in a YAML file so it's easier to separate by test
        const value: string | undefined = process.env[key];
        if (value === null || value === undefined || value === '') {
            throw new Error('Env value for "' + key + '" not defined');
        }
        return value;
    }
}
