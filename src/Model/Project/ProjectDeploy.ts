import {ProjectDeployStatus} from './ProjectDeployStatus';

export class ProjectDeploy {
    public id: number;
    public projectEnvironmentId: number;
    public userId: number;
    public requested: Date;
    public started: Date;
    public finished: Date;
    public status: ProjectDeployStatus = ProjectDeployStatus.Unknown;

    public static parse(rawProjectDeploy: any): ProjectDeploy {
        const projectDeploy: ProjectDeploy = new ProjectDeploy();

        projectDeploy.id = rawProjectDeploy.id;
        projectDeploy.projectEnvironmentId = rawProjectDeploy.projectEnvironmentId;
        projectDeploy.userId = rawProjectDeploy.userId;
        projectDeploy.requested = rawProjectDeploy.requested;
        projectDeploy.started = rawProjectDeploy.started;
        projectDeploy.finished = rawProjectDeploy.finished;
        projectDeploy.status = ProjectDeployStatus.fromString(rawProjectDeploy.status);

        return projectDeploy;
    }
}
