export class InfrastructureConfiguration {
    public static readonly KEY_FLOW_RUN_ENABLED: string = 'flow_run_enabled';

    public static readonly KEY_FLOW_RUN_VERSION: string = 'flow_run_version';

    public static readonly KEY_FLOW_RUN_WORKER_IMAGE: string = 'flow_run_worker_image';
    public static readonly KEY_FLOW_RUN_WORKER_NAME: string = 'flow_run_worker_name';
    public static readonly KEY_FLOW_RUN_WORKER_SCALE: string = 'flow_run_worker_scale';
    public static readonly KEY_FLOW_RUN_WORKER_SCALE_LIMIT: string = 'flow_run_worker_scale_limit'
    // API used for the worker
    public static readonly KEY_FLOW_RUN_WORKER_API_ENDPOINT: string = 'flow_run_worker_api_endpoint';
    // Token Id for the worker
    public static readonly KEY_FLOW_RUN_WORKER_API_TOKEN: string = 'flow_run_worker_api_token';

    // API used to run flow run code
    public static readonly KEY_FLOW_RUN_CODE_API_ENDPOINT: string = 'flow_run_code_api_endpoint';
    // Token Id used to run flow run code
    public static readonly KEY_FLOW_RUN_CODE_API_TOKEN: string = 'flow_run_code_api_token';

    public static readonly KEY_FLOW_RUN_WORKER_MEMORY_LIMIT: string = 'flow_run_worker_memory_limit';
    public static readonly KEY_FLOW_RUN_WORKER_CPU_LIMIT: string = 'flow_run_worker_cpu_limit';

    public static readonly KEY_FLOW_RUN_QUEUE_NAME: string = 'flow_run_queue_name';
    public static readonly KEY_FLOW_RUN_QUEUE_SUFFIX: string = 'flow_run_queue_suffix';
}
