import {OAuthClientToken} from './Http/OAuthClientToken.js';
import {RunnerEndpoint} from './Service/RunnerEndpoint.js';
import {AdapterEndpoint} from './Service/AdapterEndpoint.js';
import {ProjectEnvironmentEndpoint} from './Service/ProjectEnvironmentEndpoint.js';
import {ProjectEndpoint} from './Service/ProjectEndpoint.js';
import {FlowRunRequestEndpoint} from './Service/FlowRunRequestEndpoint.js';
import {OAuthClient} from './Http/OAuthClient.js';
import {WorkspaceEndpoint} from './Service/WorkspaceEndpoint.js';
import {UserEndpoint} from './Service/UserEndpoint.js';
import {ConfigEndpoint} from './Service/ConfigEndpoint.js';
import {SubscriberEndpoint} from './Service/SubscriberEndpoint.js';
import {FlowEndpoint} from './Service/FlowEndpoint.js';
import {WorkspaceMemberEndpoint} from './Service/WorkspaceMemberEndpoint.js';
import {StorageEndpoint} from './Service/StorageEndpoint.js';
import {InboxEndpoint} from './Service/InboxEndpoint.js';
import {Endpoint} from './Service/Endpoint.js';
import {CodeDeployEndpoint} from './Service/CodeDeployEndpoint.js';
import {SourcesAccountEndpoint} from './Service/SourcesAccountEndpoint.js';
import {OAuthClientOptions} from './Http/OAuthClientOptions.js';
import {PlatformLanguageEndpoint} from './Service/PlatformLanguageEndpoint.js';
import {ChannelEndpoint} from './Service/ChannelEndpoint.js';
import {HealthAlertEndpoint} from './Service/HealthAlertEndpoint.js';
import {FlowRunEndpoint} from './Service/FlowRunEndpoint.js';
import {LogEndpoint} from './Service/LogEndpoint.js';
import {TriggerEndpoint} from './Service/TriggerEndpoint.js';
import {PlatformEndpoint} from './Service/PlatformEndpoint.js';
import {FlowRunStatsEndpoint} from './Service/FlowRunStatsEndpoint.js';
import {FirewallEndpoint} from './Service/FirewallEndpoint.js';
import {CodeSourceStrategiesEndpoint} from './Service/CodeSourceStrategiesEndpoint.js';
import {SearchEndpoint} from './Service/SearchEndpoint.js';
import {UserActionEndpoint} from './Service/UserActionEndpoint.js';
import {AccessTokenEndpoint} from './Service/AccessTokenEndpoint.js';
import {AdapterConnectionEndpoint} from './Service/AdapterConnectionEndpoint.js';
import {VERSION} from './version.js';
import {CollectionsEndpoint} from './Service/CollectionsEndpoint.js';
import {ConfigurationEndpoint} from './Service/ConfigurationEndpoint.js';

export class Client {
    private readonly endpoints: Map<string, any>;
    private httpClient: OAuthClient;
    private readonly Store: any = {
        AccessTokenEndpoint,
        AdapterConnectionEndpoint,
        AdapterEndpoint,
        ChannelEndpoint,
        CodeDeployEndpoint,
        CodeSourceStrategiesEndpoint,
        ConfigEndpoint,
        FirewallEndpoint,
        FlowEndpoint,
        FlowRunEndpoint,
        FlowRunRequestEndpoint,
        FlowRunStatsEndpoint,
        HealthAlertEndpoint,
        InboxEndpoint,
        LogEndpoint,
        PlatformEndpoint,
        PlatformLanguageEndpoint,
        ProjectEndpoint,
        ProjectEnvironmentEndpoint,
        SearchEndpoint,
        SourcesAccountEndpoint,
        StorageEndpoint,
        SubscriberEndpoint,
        TriggerEndpoint,
        UserActionEndpoint,
        UserEndpoint,
        ConfigurationEndpoint,
        RunnerEndpoint,
        WorkspaceEndpoint,
        WorkspaceMemberEndpoint,
        CollectionsEndpoint,
    };

    private readonly apiEndpoint: string = 'https://api.attlaz.com';

    private parseConfig(config: Record<string, unknown>): { apiEndpoint: string | undefined } {
        // TODO: go over other records in config and warn if any unknown ones

        return config as any;
    }

    constructor(token: string | null = null, config: { apiEndpoint: string | undefined } = {apiEndpoint: undefined}) {
        const parsedConfig = this.parseConfig(config);

        if (parsedConfig.apiEndpoint !== undefined) {
            this.apiEndpoint = parsedConfig.apiEndpoint;
        }

        const options: OAuthClientOptions = new OAuthClientOptions(this.apiEndpoint);
        this.httpClient = new OAuthClient(options);
        if (token !== null) {
            const clientToken: OAuthClientToken = new OAuthClientToken(token, 'Bearer', '', '');
            this.httpClient.setToken(clientToken);
        }

        this.endpoints = new Map<string, any>();
    }

    public setClientCredentials(clientId: string, clientSecret: string = ''): void {
        const options: OAuthClientOptions = new OAuthClientOptions(this.apiEndpoint, clientId, clientSecret);
        // TODO: how to know these scopes?
        options.scopes = ['all'];
        // TODO: do we need to create a new oauth client, or can we update with these credentials?
        this.httpClient = new OAuthClient(options);
    }

    public getHttpClient(): OAuthClient {
        return this.httpClient;
    }

    public async authenticate(): Promise<boolean>;
    public async authenticate(username: string, password: string): Promise<boolean>;
    public async authenticate(username: string | null = null, password: string | null = null): Promise<boolean> {
        if (username === null || password === null) {
            return await this.httpClient.authenticate();
        }
        // TODO: this is only possible when clientId and clientSecret are defined
        return await this.httpClient.authenticate(username, password);
    }

    public isAuthenticated(): boolean {
        return this.httpClient.isAuthenticated();
    }

    public getToken(): OAuthClientToken | null {
        return this.httpClient.getToken();
    }

    public setToken(token: OAuthClientToken): void {
        this.httpClient.setToken(token);
    }

    public unsetAccessToken(): void {
        this.httpClient.unsetToken();
    }

    public async getApiInformation(): Promise<{ version: string }> {
        const result: {
            version: string | undefined
        } = await this.httpClient.request('/system/health', null, 'GET', false);
        if (result.version === undefined) {
            throw new Error('Unable to get API information: invalid response');
        }
        return {version: result.version};
    }

    /* Endpoints */
    public getAdapterEndpoint(): AdapterEndpoint {
        return this.getEndpoint('adapter', this.Store.AdapterEndpoint);
    }

    public getAdapterConnectionEndpoint(): AdapterConnectionEndpoint {
        return this.getEndpoint('adapter-connection', this.Store.AdapterConnectionEndpoint);
    }

    public getProjectEndpoint(): ProjectEndpoint {
        return this.getEndpoint('project', this.Store.ProjectEndpoint);
    }

    public getProjectEnvironmentEndpoint(): ProjectEnvironmentEndpoint {
        return this.getEndpoint('project-environment', this.Store.ProjectEnvironmentEndpoint);
    }

    public getCodeDeployEndpoint(): CodeDeployEndpoint {
        return this.getEndpoint('code-deploy', this.Store.CodeDeployEndpoint);
    }

    public getChannelEndpoint(): ChannelEndpoint {
        return this.getEndpoint('channel', this.Store.ChannelEndpoint);
    }

    public getConfigEndpoint(): ConfigEndpoint {
        return this.getEndpoint('config', this.Store.ConfigEndpoint);
    }

    public getInboxEndpoint(): InboxEndpoint {
        return this.getEndpoint('inbox', this.Store.InboxEndpoint);
    }

    public getPlatformEndpoint(): PlatformEndpoint {
        return this.getEndpoint('platform', this.Store.PlatformEndpoint);
    }

    public getSubscriberEndpoint(): SubscriberEndpoint {
        return this.getEndpoint('subscriber', this.Store.SubscriberEndpoint);
    }

    public getLogEndPoint(): LogEndpoint {
        return this.getEndpoint('log', this.Store.LogEndpoint);
    }

    public getFlowEndpoint(): FlowEndpoint {
        return this.getEndpoint('flow', this.Store.FlowEndpoint);
    }

    public getFlowRunEndpoint(): FlowRunEndpoint {
        return this.getEndpoint('flow-run', this.Store.FlowRunEndpoint);
    }

    public getFlowRunRequestEndpoint(): FlowRunRequestEndpoint {
        return this.getEndpoint('flow-run-request', this.Store.FlowRunRequestEndpoint);
    }

    public getFlowRunStatsEndpoint(): FlowRunStatsEndpoint {
        return this.getEndpoint('flow-run-stats', this.Store.FlowRunStatsEndpoint);
    }

    public getWorkspaceEndpoint(): WorkspaceEndpoint {
        return this.getEndpoint('workspaces', this.Store.WorkspaceEndpoint);
    }

    public getTriggerEndpoint(): TriggerEndpoint {
        return this.getEndpoint('trigger', this.Store.TriggerEndpoint);
    }

    public getUserEndpoint(): UserEndpoint {
        return this.getEndpoint('user', this.Store.UserEndpoint);
    }

    public getWorkspaceMemberEndpoint(): WorkspaceMemberEndpoint {
        return this.getEndpoint('member', this.Store.WorkspaceMemberEndpoint);
    }

    public getRunnerEndpoint(): RunnerEndpoint {
        return this.getEndpoint('worker', this.Store.RunnerEndpoint);
    }

    public getSourcesAccountEndpoint(): SourcesAccountEndpoint {
        return this.getEndpoint('sources-account', this.Store.SourcesAccountEndpoint);
    }

    public getLanguageEndpoint(): PlatformLanguageEndpoint {
        return this.getEndpoint('language', this.Store.PlatformLanguageEndpoint);
    }

    public getStorageEndpoint(): StorageEndpoint {
        return this.getEndpoint('storage', this.Store.StorageEndpoint);
    }

    public getConfigurationEndpoint(): ConfigurationEndpoint {
        return this.getEndpoint('configuration', this.Store.ConfigurationEndpoint);
    }

    public getHealthAlertEndpoint(): HealthAlertEndpoint {
        return this.getEndpoint('healt-alert', this.Store.HealthAlertEndpoint);
    }

    public getCodeSourceStrategiesEndpoint(): CodeSourceStrategiesEndpoint {
        return this.getEndpoint('code-source-strategies', this.Store.CodeSourceStrategiesEndpoint);
    }

    public getSearchEndpoint(): SearchEndpoint {
        return this.getEndpoint('search', this.Store.SearchEndpoint);
    }

    public getUserActionEndpoint(): UserActionEndpoint {
        return this.getEndpoint('useraction', this.Store.UserActionEndpoint);
    }

    public getAccessTokenEndpoint(): AccessTokenEndpoint {
        return this.getEndpoint('accesstoken', this.Store.AccessTokenEndpoint);
    }

    public getCollectionsEndpoint(): CollectionsEndpoint {
        return this.getEndpoint('collections', this.Store.CollectionsEndpoint);
    }

    // TODO: this should be in a separate API?
    public getFirewallEndpoint(): FirewallEndpoint {
        return this.getEndpoint('firewall', this.Store.FirewallEndpoint);
    }

    private getEndpoint<T extends Endpoint>(key: string, ClassName: { new(x: OAuthClient): T; }): T {
        // const classNameString: string = className.name;

        if (!this.endpoints.has(key)) {
            // if (this.Store[classNameString] === undefined || this.Store[classNameString] === null) {
            //     throw new Error(`Class type of \'${classNameString}\' is not in the store`);
            // }
            try {
                const endpoint: Endpoint = new ClassName(this.httpClient);
                this.endpoints.set(key, endpoint);
            } catch (error: any) {
                throw new Error('Unable to initialize ' + key + ' endpoint (' + error.message + ')');
            }
        }
        return this.endpoints.get(key);
    }

    public getVersion(): string {
        return VERSION;
    }
}
