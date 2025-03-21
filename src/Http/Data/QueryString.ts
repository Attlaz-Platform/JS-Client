import {CursorPagination} from '../../Model/Pagination/CursorPagination.js';
import {State} from '../../Model/State.js';
import {Filters} from '../../Model/Pagination/Filters.js';

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


    public addFilters(filters: Filters): void {
        for (const filter of filters.toArray()) {
            const strMethod: string = filter.method === 'eq' ? '' : '[' + filter.method + ']';
            this.set(filter.field + strMethod, filter.value);
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
            const {value} = parameter;
            if (Array.isArray(value)) {
                /** Legacy way **/
                //    output.push(parameter.parameter + '=' + encodeURIComponent(value.join(',')));
                for (const subValue of value) {
                    output.push(parameter.parameter + '=' + encodeURIComponent(subValue));
                }
            } else {
                output.push(parameter.parameter + '=' + encodeURIComponent(value));
            }
        }

        if (this.command.includes('?')) {
            return this.command + '&' + output.join('&');
        }
        return this.command + '?' + output.join('&');
    }
}
