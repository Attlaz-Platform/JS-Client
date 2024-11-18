import {Utils} from '../../Utils.js';

export enum ProjectEnvironmentType {
    Production = 'prod',
    Test = 'test',
    Local = 'locl',
}

export namespace ProjectEnvironmentType {
    export const fromString = (input: string): ProjectEnvironmentType => {
        const result: ProjectEnvironmentType | null = Utils.parseEnum<ProjectEnvironmentType>(input, ProjectEnvironmentType);
        if (result === null) {
            throw new Error('Unable to parse ProjectEnvironmentType from string: Unknown ProjectEnvironmentType "' + input + '"');
        }
        return result;
    }
}
