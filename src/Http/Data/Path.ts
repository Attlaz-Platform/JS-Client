/**
 * Build a request path from a template, encoding every value that goes into it.
 *
 *     path('/data-quality/datasets/:datasetId/scans', {datasetId})
 *
 * Ids are opaque strings supplied by the caller. Concatenating them straight into a URL means a
 * value containing `/`, `?` or `#` silently changes which endpoint is called; an empty one produces
 * a path that quietly addresses the collection instead of the item. Encoding here makes the request
 * mean what it says, and an empty value an error rather than a surprise.
 */
export function path(template: string, parameters: Record<string, string | number> = {}): string {
    const used: Set<string> = new Set<string>();

    const built: string = template.replace(/:([A-Za-z][A-Za-z0-9_]*)/g, (_match: string, name: string): string => {
        if (!Object.prototype.hasOwnProperty.call(parameters, name)) {
            throw new Error('Unable to build path "' + template + '": no value for ":' + name + '"');
        }
        used.add(name);

        const value: string = String(parameters[name]);
        if (value === '') {
            throw new Error('Unable to build path "' + template + '": ":' + name + '" is empty');
        }

        return encodeURIComponent(value);
    });

    // A value with no matching placeholder is a typo that would otherwise vanish silently.
    for (const name of Object.keys(parameters)) {
        if (!used.has(name)) {
            throw new Error('Unable to build path "' + template + '": no placeholder for "' + name + '"');
        }
    }

    return built;
}
