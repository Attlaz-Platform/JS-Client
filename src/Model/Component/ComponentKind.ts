export enum ComponentKind {
    Api = 'api',
    Service = 'service',
    Runner = 'runner',
}

export namespace ComponentKind {

    export const fromString = (input: string): ComponentKind => {
        switch (input) {
            case ComponentKind.Api:
            case ComponentKind.Service:
            case ComponentKind.Runner:
                return input as ComponentKind;
            default:
                throw new Error('Unknown ComponentKind "' + input + '"');
        }
    }
}
