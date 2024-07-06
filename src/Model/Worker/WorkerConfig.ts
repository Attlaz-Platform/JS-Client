import {DataValueValue} from '../DataValue.js';

export class WorkerConfig {
    public static KEY_STATE: string = 'state';

    public static KEY_SCALE: string = 'scale';

    public static KEY_MEMORY_LIMIT: string = 'memory_limit';
    public static KEY_CPU_LIMIT: string = 'cpu_limit';

    public static KEY_RUNNER_IMAGE: string = 'runner_image';
    public static KEY_API_ENDPOINT_WORKER: string = 'api_endpoint_worker';

    public static KEY_API_ENDPOINT: string = 'api_endpoint';
    public static KEY_API_CLIENT_ID: string = 'api_client_id';
    public static KEY_API_CLIENT_SECRET: string = 'api_client_secret';

    constructor(public readonly projectEnvironmentId: string, public readonly key: string, public readonly value: DataValueValue | null) {

    }

    public static parse(raw: any): WorkerConfig {
        return new WorkerConfig(raw.project_environment, raw.key, raw.value);
    }
}
