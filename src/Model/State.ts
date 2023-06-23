import {Utils} from '../Utils.js';

export enum State {
    Active = 'active',
    Inactive = 'inactive',
    Removed = 'removed',

}

export namespace State {
    export function fromString(input: string): State {
        const result: State | null = Utils.parseEnum<State>(input, State);
        if (result === null) {
            throw new Error('Unable to parse State from string: Unknown State "' + input + '"');
        }
        return result;
    }
}
