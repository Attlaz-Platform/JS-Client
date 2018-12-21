export class Project {
    public id: string;
    public key: string;
    public name: string;
    public default: boolean = false;
    public active: boolean = true;

    constructor(id: string, key: string, name: string) {
        this.id = id;
        this.key = key;
        this.name = name;
    }

    public static parse(rawProject: any): Project {
        let project: Project = new Project(rawProject.id, rawProject.code, rawProject.name);
        project.default = (rawProject.default.toString() === '1');
        project.active = (rawProject.active.toString() === '1');
        return project;
    }
}
