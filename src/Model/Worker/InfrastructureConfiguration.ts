export class InfrastructureConfiguration {
    public static readonly KEY_FLOW_RUN_ENABLED: string = 'flow_run_enabled';

    public static readonly KEY_FLOW_RUN_VERSION: string = 'flow_run_version';

    public static readonly KEY_FLOW_RUN_WORKER_IMAGE: string = 'flow_run_worker_image';
    public static readonly KEY_FLOW_RUN_WORKER_NAME: string = 'flow_run_worker_name';
    public static readonly KEY_FLOW_RUN_WORKER_SCALE: string = 'flow_run_worker_scale';
    public static readonly KEY_FLOW_RUN_WORKER_SCALE_LIMIT: string = 'flow_run_worker_scale_limit'
    // Endpoint the runner process itself calls back to
    public static readonly KEY_FLOW_RUN_RUNNER_ENDPOINT: string = 'flow_run_runner_endpoint';
    // OAuthAccessTokenId the runner authenticates with
    public static readonly KEY_FLOW_RUN_RUNNER_TOKEN: string = 'flow_run_runner_token';

    // Endpoint injected into the customer flow code
    public static readonly KEY_FLOW_RUN_CODE_ENDPOINT: string = 'flow_run_code_endpoint';
    // OAuthAccessTokenId injected into the customer flow code
    public static readonly KEY_FLOW_RUN_CODE_TOKEN: string = 'flow_run_code_token';

    public static readonly KEY_FLOW_RUN_WORKER_MEMORY_LIMIT: string = 'flow_run_worker_memory_limit';
    public static readonly KEY_FLOW_RUN_WORKER_CPU_LIMIT: string = 'flow_run_worker_cpu_limit';

    public static readonly KEY_FLOW_RUN_QUEUE_NAME: string = 'flow_run_queue_name';
    public static readonly KEY_FLOW_RUN_QUEUE_SUFFIX: string = 'flow_run_queue_suffix';
}
