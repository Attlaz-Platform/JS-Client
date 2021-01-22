import {Utils} from '../Utils';

export enum State {
    Active = 'active',
    Inactive = 'inactive',
    Removed = 'removed',

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


