import {Utils} from '../../Utils.js';

export enum FlowRunPriority {
    None = 0,
    Low = 1,
    Medium = 2,
    High = 3,

}

export namespace FlowRunPriority {
    export function fromString(input: string): FlowRunPriority {
        const result: FlowRunPriority | null = Utils.parseEnum<FlowRunPriority>(input, FlowRunPriority);
        if (result === null) {
            throw new Error('Unable to parse FlowRunPriority from string: Unknown FlowRunPriority "' + input + '"');
        }
        return result;
    }
}
