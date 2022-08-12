import {Endpoint} from './Endpoint';
import {TaskExecutionStats} from '../Model/TaskExecution/TaskExecutionStats';
import {DataResult} from '../Model/Result/DataResult';

export class TaskExecutionStatsEndpoint extends Endpoint {
    public async create(taskExecutionStats: TaskExecutionStats): Promise<DataResult<TaskExecutionStats>> {

        let url: string = '/taskexecutions/' + taskExecutionStats.taskExecution + '/stats';

        try {
            const result: DataResult<any> = await this.request(url, taskExecutionStats, 'POST');

            return new DataResult<TaskExecutionStats>(taskExecutionStats);
        } catch (ex) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to create task execution stats: ', ex);
            }

            throw ex;
        }

    }
}
