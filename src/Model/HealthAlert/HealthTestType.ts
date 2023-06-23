import {Utils} from '../../Utils.js';

export enum HealthTestType {
    PROJECT_ENVIRONMENT_HAS_WORKERS = 'project_environment_has_workers',
    QUEUE_FLOW_IS_HEALTHY = 'queue_flow_is_healthy',
    WORKER_IS_UP_TO_DATE = 'worker_is_up_to_date',
    /** @deprecated **/
    TASK_EXECUTIONS_ARE_SUCCESSFUL = 'task_executions_are_successful',
    FLOW_RUNS_ARE_SUCCESSFUL = 'flow_runs_are_successful',
}

export namespace HealthTestType {

    export function fromString(input: string): HealthTestType {
        const result: HealthTestType | null = Utils.parseEnum<HealthTestType>(input, HealthTestType);
        if (result === null) {
            throw new Error('Unable to parse HealthTestType from string: Unknown HealthTestType "' + input + '"');
        }
        return result;
    }

}
