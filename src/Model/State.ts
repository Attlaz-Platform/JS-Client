import {Utils} from '../Utils';

export enum State {
    Active = 'active' as any,
    Inactive = 'inactive' as any,
    Removed = 'removed' as any,

}

export namespace State {
    export function fromString(input: string): State {
        const result: State = Utils.parseEnum<State>(input, State);
        if (Utils.isNullOrUndefined(result)) {
            throw new Error('Unable to parse State from string: Unknown State "' + input + '"');
        }
        return result;
    }
}


