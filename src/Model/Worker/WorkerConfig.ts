export class WorkerConfig {

    public static KEY_STATE: string = 'state';
    public static KEY_SCALE: string = 'scale';
    public static KEY_MEMORY_LIMIT: string = 'memory_limit';
    public static KEY_CPU_LIMIT: string = 'cpu_limit';
    public static KEY_IMAGE: string = 'image';

    public projectEnvironment: number;
    public key: string;
    public value: string;

    constructor(project_environment: number, key: string, value: string) {
        this.projectEnvironment = project_environment;
        this.key = key;
        this.value = value;
    }

    public static parse(raw: any): WorkerConfig {
        return new WorkerConfig(raw.projectEnvironment, raw.key, raw.value);
    }
}
