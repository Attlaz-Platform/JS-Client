export class ObjectWrapper {
    public static wrap<T>(raw: T, strict: boolean = false): T {
        const handler: ProxyHandler<any> = {
            get(target: any, property: string, receiver: any) {
                const value: any = target[property];
                if (value === undefined) {
                    if (strict) {
                        throw new Error('Property "' + property + '" does not exist');
                    } else {
                        console.error('Property "' + property + '" does not exist', {object: raw});
                    }
                }
                return value;
            },
        };
        const wrapper: any = new Proxy(raw, handler);
        return wrapper;
    }
}
