import {Utils} from '../../Utils.js';

export enum HealthTestType {
    PROJECT_ENVIRONMENT_HAS_WORKERS = 'project_environment_has_workers',
    QUEUE_FLOW_IS_HEALTHY = 'queue_flow_is_healthy',
    WORKER_IS_UP_TO_DATE = 'worker_is_up_to_date',
    /** The runners are on the image the pool is configured to run. Drift means it needs redeploying. */
    RUNNER_POOL_IMAGE_IS_CURRENT = 'runner_pool_image_is_current',
    ADAPTER_CONNECTION_IS_HEALTHY = 'adapter_connection_is_healthy',
    FLOW_RUNS_ARE_SUCCESSFUL = 'flow_runs_are_successful',

    STORAGE_CACHE_USAGE_WITHIN_LIMIT = 'storage_cache_usage_within_limit',
    STORAGE_PERSISTENT_USAGE_WITHIN_LIMIT = 'storage_persistent_usage_within_limit',
    STORAGE_VAULT_USAGE_WITHIN_LIMIT = 'storage_vault_usage_within_limit',
    STORAGE_INFRASTRUCTURE_USAGE_WITHIN_LIMIT = 'storage_infrastructure_usage_within_limit',
}

export namespace HealthTestType {

    export const fromString = (input: string): HealthTestType => {
        const result: HealthTestType | null = Utils.parseEnum<HealthTestType>(input, HealthTestType);
        if (result === null) {
            throw new Error('Unable to parse HealthTestType from string: Unknown HealthTestType "' + input + '"');
        }
        return result;
    }

}
