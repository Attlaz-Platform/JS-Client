import {CursorPagination} from '../../Model/Pagination/CursorPagination.js';
import {State} from '../../Model/State.js';

export class QueryString {

    private parameters: { parameter: string; value: string | number | boolean | string[] }[] = [];

    public constructor(private command: string = '') {
    }

    public setCommand(command: string): void {
        this.command = command;
    }

    public set(parameter: string, value: string | number | boolean | string[]): void {
        const existingParam = this.parameters.find((param) => param.parameter === parameter);
        if (existingParam !== undefined) {
            throw new Error('Param already defined');
        }
        this.parameters.push({parameter, value});
    }

    public addPagination(pagination: CursorPagination | null): void {
        if (pagination !== null && pagination !== undefined) {
            if (pagination.limit !== null && pagination.limit !== undefined) {
                this.set('limit', pagination.limit);
            }
            if (pagination.startingAfter !== null && pagination.startingAfter !== undefined && pagination.startingAfter !== '') {
                this.set('starting_after', pagination.startingAfter);
            }
            if (pagination.endingBefore !== null && pagination.endingBefore !== undefined && pagination.endingBefore !== '') {
                this.set('ending_before', pagination.endingBefore);
            }
        }
    }

    public addStateFilter(states: State[] | null): void {
        if (states !== null) {
            this.set('state', states);
        }
    }

    public getParameters() {
        return this.parameters;
    }

    public build(): string {
        if (this.parameters.length === 0) {
            return this.command;
        }
        const output: string[] = [];
        for (const parameter of this.parameters) {
            let {value} = parameter;
            if (Array.isArray(value)) {
                value = value.join(',');
            }
            output.push(parameter.parameter + '=' + encodeURIComponent(value));
        }

        if (this.command.includes('?')) {
            return this.command + '&' + output.join('&');
        }
        return this.command + '?' + output.join('&');
    }
}
