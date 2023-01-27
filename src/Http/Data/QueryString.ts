export class QueryString {

    private parameters: { parameter: string; value: string | number | boolean | string[] }[] = [];

    public set(parameter: string, value: string | number | boolean | string[]): void {
        this.parameters.push({parameter, value})
    }

    public getParameters() {
        return this.parameters;
    }

    public build(): string {
        if (this.parameters.length === 0) {
            return '';
        }
        const output: string[] = [];
        for (const parameter of this.parameters) {
            let value = parameter.value;
            if (Array.isArray(value)) {
                value = value.join(',');
            }
            output.push(parameter.parameter + '=' + value);
        }
        return '?' + output.join('&');
    }
}
