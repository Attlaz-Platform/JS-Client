export class Project {
    public id: string;
    public code: string;
    public name: string;
    public default: boolean = false;
    public active: boolean = true;

    constructor(id: string, code: string, name: string) {
        this.id = id;
        this.code = code;
        this.name = name;
    }

    public static parse(rawProject: any): Project {
        let project: Project = new Project(rawProject.id, rawProject.code, rawProject.name);
        project.default = (rawProject.default.toString() === '1');
        project.active = (rawProject.active.toString() === '1');
        return project;
    }
}
