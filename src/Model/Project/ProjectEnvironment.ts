export class ProjectEnvironment {
    public id: number;
    public key: string;
    public projectId: string;
    public name: string;
    public sourceBranch: string;
    public parent: number = null;

    public static parse(rawProjectEnvironment: any): ProjectEnvironment {
        const projectEnvironment: ProjectEnvironment = new ProjectEnvironment();

        projectEnvironment.id = rawProjectEnvironment.id;
        projectEnvironment.key = rawProjectEnvironment.key;
        projectEnvironment.projectId = rawProjectEnvironment.project;
        projectEnvironment.name = rawProjectEnvironment.name;
        projectEnvironment.sourceBranch = rawProjectEnvironment.source_branch;
        projectEnvironment.parent = rawProjectEnvironment.parent;

        return projectEnvironment;
    }
}
