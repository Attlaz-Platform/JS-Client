export class Filters {
    /**
     * gte = greater than or equal
     * gt = greater than
     * lte = less than or equal
     * lt = more than
     * eq = equal
     * in = in
     */
    private readonly filters: Filter[] = [];

    public addEqualFilter(field: string, value: string | number): void {

        this.filters.push(
            {
                field: field,
                method: 'eq',
                value: value,
            },
        );
    }

    public addBetweenFilter(field: string, valueA: string | number, valueB: string | number): void {
        this.filters.push(
            {
                field: field,
                method: 'gte',
                value: valueA,
            },
        );
        this.filters.push(
            {
                field: field,
                method: 'lte',
                value: valueB,
            },
        );
    }

    public toArray(): Filter[] {
        return this.filters;
    }


}

type Filter = {
    field: string,
    method: string;
    value: string | number
}
