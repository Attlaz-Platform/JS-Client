import {Utils} from '../Utils';

export enum State {
    Active = 'active' as any,
    Inactive = 'inactive' as any,
    Removed = 'removed' as any,

}

export namespace State {

    export function fromString(state: string): State {
        let result: State;
        if (Utils.isNullOrUndefined(state)) {
            throw new Error('Unable to parse state from string: state not defined');
        }
        switch (state.toLowerCase()) {
            case 'active':
                result = State.Active;
                break;
            case 'inactive':
                result = State.Inactive;
                break;
            case 'removed':
                result = State.Removed;
                break;

            default:
                throw new Error('Unknown state "' + state + '"');
        }

        return result;
    }

}


