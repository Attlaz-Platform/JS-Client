import {path} from '../Http/Data/Path.js';
import {QueryString} from '../Http/Data/QueryString.js';
import {Component} from '../Model/Component/Component.js';
import {ComponentKind} from '../Model/Component/ComponentKind.js';
import {ComponentStatus} from '../Model/Component/ComponentStatus.js';
import {ComponentVersion} from '../Model/Component/ComponentVersion.js';
import {CursorPagination} from '../Model/Pagination/CursorPagination.js';
import {CollectionResult} from '../Model/Result/CollectionResult.js';
import {State} from '../Model/State.js';
import {Utils} from '../Utils.js';
import {Endpoint} from './Endpoint.js';

/**
 * The platform's own inventory: what we build, which versions the registry has, what the cluster is
 * actually running, and which version each component should run.
 *
 * Root-only, reads included.
 */
export class ComponentEndpoint extends Endpoint {

    public async getAll(pagination: CursorPagination | null = null): Promise<CollectionResult<Component>> {
        const queryString: QueryString = new QueryString('/system/components');
        queryString.addPagination(pagination);

        return await this.requestCollection<Component>(queryString, ComponentEndpoint.parseComponent, null, 'GET');
    }

    public async getVersions(componentId: string, pagination: CursorPagination | null = null): Promise<CollectionResult<ComponentVersion>> {
        const queryString: QueryString = new QueryString(path('/system/components/:componentId/versions', {componentId}));
        queryString.addPagination(pagination);

        return await this.requestCollection<ComponentVersion>(queryString, ComponentEndpoint.parseVersion, null, 'GET');
    }

    /** Observed state for every component at once — one call, not one per component. */
    public async getStatus(pagination: CursorPagination | null = null): Promise<CollectionResult<ComponentStatus>> {
        const queryString: QueryString = new QueryString('/system/component-status');
        queryString.addPagination(pagination);

        return await this.requestCollection<ComponentStatus>(queryString, ComponentEndpoint.parseStatus, null, 'GET');
    }

    /**
     * Declare which version a component should run. Writes desired state only — the rollout is a
     * separate asynchronous step that can fail, so a success here does not mean it is running.
     */
    public async setActiveVersion(componentId: string, versionId: string): Promise<void> {
        const queryString: QueryString = new QueryString(path('/system/components/:componentId/active-version', {componentId}));

        await this.requestObject(queryString, {version_id: versionId}, (raw: Record<string, unknown>) => raw, 'POST');
    }

    private static parseComponent(raw: Record<string, unknown>): Component {
        const component: Component = new Component();
        component.id = raw.id as string;
        component.name = raw.name as string;
        component.kind = ComponentKind.fromString(raw.kind as string);
        component.imageRepository = raw.image_repository as string;
        component.activeVersionId = (raw.active_version as string | null) ?? null;
        component.createdAt = Utils.parseRawDate(raw.created_at as Date);
        component.updatedAt = Utils.parseRawDate(raw.updated_at as Date);
        component.state = State.fromString(raw.state as string);
        return component;
    }

    private static parseVersion(raw: Record<string, unknown>): ComponentVersion {
        const version: ComponentVersion = new ComponentVersion();
        version.id = raw.id as string;
        version.componentId = raw.component as string;
        version.version = raw.version as string;
        version.image = raw.image as string;
        version.releasedAt = Utils.parseRawDate(raw.released_at as Date);
        version.state = State.fromString(raw.state as string);
        return version;
    }

    private static parseStatus(raw: Record<string, unknown>): ComponentStatus {
        const status: ComponentStatus = new ComponentStatus();
        status.id = raw.id as string;
        status.componentId = raw.component as string;
        status.namespace = raw.namespace as string;
        status.deploymentName = raw.deployment_name as string;
        status.image = raw.image as string;
        status.readyReplicas = raw.ready_replicas as number;
        status.desiredReplicas = raw.desired_replicas as number;
        status.available = raw.available as boolean;
        status.progressing = raw.progressing as boolean;
        status.observedAt = Utils.parseRawDate(raw.observed_at as Date);
        return status;
    }
}
