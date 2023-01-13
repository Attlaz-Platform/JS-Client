import {Endpoint} from './Endpoint';
import {ProjectEnvironment} from '../Model/Project/ProjectEnvironment';
import {DataResult} from '../Model/Result/DataResult';
import {HttpClient} from '../Http/HttpClient';

export class ProjectEnvironmentEndpoint extends Endpoint {

    public async getByProject(id: string): Promise<ProjectEnvironment[]> {

        try {
            const result: DataResult<ProjectEnvironment[]> = await this.request('/projects/' + id + '/environments');
            result.setData(this.parseCollection(result, ProjectEnvironment.parse));
            return result.getData();
        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load project environments', error);
            }

            throw error;
        }

    }

    public async getById(id: string): Promise<ProjectEnvironment | null> {

        try {
            const rawProjectEnvironment: any = await this.httpClient.request('/projectenvironments/' + id + '');
            if (rawProjectEnvironment === null || rawProjectEnvironment === undefined) {
                return null;
            }
            const projectEnvironment: ProjectEnvironment = ProjectEnvironment.parse(rawProjectEnvironment);
            return projectEnvironment;
        } catch (error: any) {
            if (error.code === HttpClient.HTTP_NOTFOUND) {
                return null;
            }
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load project environment by id', error);
            }

            throw error;
        }

    }

    public async save(projectEnvironment: ProjectEnvironment): Promise<ProjectEnvironment> {

        try {
            const rawProjectEnvironment: any = await this.httpClient.request('projectenvironments/', projectEnvironment, 'POST');

            // TODO: parse result
            const savedProjectEnvironment: ProjectEnvironment = ProjectEnvironment.parse(rawProjectEnvironment);
            return savedProjectEnvironment;

        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to save project environment', error, projectEnvironment);
            }

            throw error;
        }
    }
}
