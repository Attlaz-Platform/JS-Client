import {DataValueValue} from '../DataValue.js';

export class WorkerConfig {
    public static KEY_STATE: string = 'state';

    public static KEY_SCALE: string = 'scale';

    public static KEY_MEMORY_LIMIT: string = 'memory_limit';
    public static KEY_CPU_LIMIT: string = 'cpu_limit';

    public static KEY_PLATFORM: string = 'platform';
    public static KEY_WORKER_VERSION: string = 'worker_version';

    public static KEY_API_ENDPOINT: string = 'api_endpoint';
    public static KEY_API_CLIENT_ID: string = 'api_client_id';
    public static KEY_API_CLIENT_SECRET: string = 'api_client_secret';

    public projectEnvironmentId: string;
    public key: string;
    public value: DataValueValue | null;

    constructor(projectEnvironmentId: string, key: string, value: DataValueValue | null) {
        this.projectEnvironmentId = projectEnvironmentId;
        this.key = key;
        this.value = value;
    }

    public static parse(raw: any): WorkerConfig {
        return new WorkerConfig(raw.project_environment, raw.key, raw.value);
    }
}
