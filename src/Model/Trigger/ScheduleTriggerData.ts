import {TriggerData} from './TriggerData';

export class ScheduleTriggerData extends TriggerData {
    public expression: string;

    public constructor(expression: string) {
        super();
        this.expression = expression;
    }
}
