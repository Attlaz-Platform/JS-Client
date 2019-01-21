import {TaskExecutionStatus} from "./TaskExecutionStatus";
import {TaskExecution} from './TaskExecution';
import {ParseHelper} from '../Helper/ParseHelper';

export class TaskExecutionSummary extends TaskExecution {

    public time: Date;
    public duration: number;
    public status: TaskExecutionStatus = TaskExecutionStatus.Unknown;


    public static parse(rawTaskExecutionSummary: any): TaskExecutionSummary {
        let taskExecutionSummary: TaskExecutionSummary = TaskExecution.parse(rawTaskExecutionSummary) as TaskExecutionSummary;

        if(rawTaskExecutionSummary.time !== null && rawTaskExecutionSummary.time !== undefined)
        taskExecutionSummary.time = ParseHelper.parseRawDate(rawTaskExecutionSummary.time);
        taskExecutionSummary.duration = rawTaskExecutionSummary.duration;
        taskExecutionSummary.status = rawTaskExecutionSummary.status;


        return taskExecutionSummary;
    }
}
