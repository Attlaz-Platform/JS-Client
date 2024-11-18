import {ProjectEnvironment} from '../Model/Project/ProjectEnvironment.js';
import {CollectionResult} from '../Model/Result/CollectionResult.js';
import {ObjectResult} from '../Model/Result/ObjectResult.js';
import {ProjectEnvironmentConfiguration} from '../Model/Project/ProjectEnvironmentConfiguration.js';
import {HttpStatus} from '../Http/HttpStatus.js';
import {Endpoint} from './Endpoint.js';

export class ProjectEnvironmentEndpoint extends Endpoint {
    public async getByProject(id: string): Promise<CollectionResult<ProjectEnvironment>> {
        try {
            const result: CollectionResult<ProjectEnvironment> = await this.requestCollection<ProjectEnvironment>('/projects/' + id + '/environments', ProjectEnvironment.parse);
            return result;
        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load project environments', error);
            }

            throw error;
        }
    }

    public async getById(id: string): Promise<ProjectEnvironment | null> {
        try {
            const rawProjectEnvironment: ObjectResult<ProjectEnvironment> = await this.requestObject<ProjectEnvironment>('/projectenvironments/' + id + '', null, ProjectEnvironment.parse);
            return rawProjectEnvironment.getData();
        } catch (error: any) {
            if (error.httpStatus === HttpStatus.HTTP_NOTFOUND) {
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
            const result: ObjectResult<ProjectEnvironment> = await this.requestObject<ProjectEnvironment>('projectenvironments/', projectEnvironment, ProjectEnvironment.parse, 'POST');
            const createdProjectEnvironment: ProjectEnvironment | null = result.getData();
            if (createdProjectEnvironment === null) {
                throw new Error('ProjectEnvironment not created');
            }
            return createdProjectEnvironment;
        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to save project environment', error, projectEnvironment);
            }

            throw error;
        }
    }

    public async getConfigByKey(projectEnvironmentId: string, configKey: string): Promise<ProjectEnvironmentConfiguration | null> {
        try {
            const parser = (raw: any): ProjectEnvironmentConfiguration => {
                const value: ProjectEnvironmentConfiguration = new ProjectEnvironmentConfiguration();
                value.id = raw.id;
                value.key = raw.key;
                value.environment = raw.environment;
                value.value = raw.value;
                return value;
            };
            const rawProjectEnvironment: ObjectResult<ProjectEnvironmentConfiguration> = await this.requestObject('/projectenvironments/' + projectEnvironmentId + '/configurations/' + configKey, null, parser);
            return rawProjectEnvironment.getData();
        } catch (error: any) {
            if (error.httpStatus === HttpStatus.HTTP_NOTFOUND) {
                return null;
            }
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load project environment configuration', error);
            }

            throw error;
        }
    }
}
