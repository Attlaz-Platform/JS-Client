import {OAuthClientToken} from './Http/OAuthClientToken';
import {WorkerEndpoint} from './Service/WorkerEndpoint';
import {AdapterEndpoint} from './Service/AdapterEndpoint';
import {ProjectEnvironmentEndpoint} from './Service/ProjectEnvironmentEndpoint';
import {ProjectEndpoint} from './Service/ProjectEndpoint';
import {FlowRunRequestEndpoint} from './Service/FlowRunRequestEndpoint';
import {OAuthClient} from './Http/OAuthClient';
import {WorkerConfigEndpoint} from './Service/WorkerConfigEndpoint';
import {WorkspaceEndpoint} from './Service/WorkspaceEndpoint';
import {UserEndpoint} from './Service/UserEndpoint';
import {ConfigEndpoint} from './Service/ConfigEndpoint';
import {SubscriberEndpoint} from './Service/SubscriberEndpoint';
import {FlowEndpoint} from './Service/FlowEndpoint';
import {WorkspaceMemberEndpoint} from './Service/WorkspaceMemberEndpoint';
import {StorageEndpoint} from './Service/StorageEndpoint';
import {QueueEndpoint} from './Service/QueueEndpoint';
import {NotificationsEndpoint} from './Service/NotificationsEndpoint';
import {Endpoint} from './Service/Endpoint';
import {ProjectDeployEndpoint} from './Service/ProjectDeployEndpoint';
import {SourcesAccountEndpoint} from './Service/SourcesAccountEndpoint';
import {OAuthClientOptions} from './Http/OAuthClientOptions';
import {PlatformLanguageEndpoint} from './Service/PlatformLanguageEndpoint';
import {ChannelEndpoint} from './Service/ChannelEndpoint';
import {HealthAlertEndpoint} from './Service/HealthAlertEndpoint';
import {FlowRunEndpoint} from './Service/FlowRunEndpoint';
import {LogEndpoint} from './Service/LogEndpoint';
import {TriggerEndpoint} from './Service/TriggerEndpoint';
import {PlatformEndpoint} from './Service/PlatformEndpoint';
import {FlowRunStatsEndpoint} from './Service/FlowRunStatsEndpoint';
import {VERSION} from './version';

export class Client {

    private endpoints: Map<string, any>;
    private readonly httpClient: OAuthClient;
    private Store: any = {
        WorkerEndpoint,
        AdapterEndpoint,
        ProjectEndpoint,
        ProjectEnvironmentEndpoint,
        ProjectDeployEndpoint,
        QueueEndpoint,
        ChannelEndpoint,
        ConfigEndpoint,
        NotificationsEndpoint,
        SubscriberEndpoint,
        LogEndpoint,
        FlowEndpoint,
        FlowRunEndpoint,
        FlowRunRequestEndpoint,
        WorkspaceEndpoint,
        TriggerEndpoint,
        UserEndpoint,
        WorkspaceMemberEndpoint,
        SourcesAccountEndpoint,
        PlatformLanguageEndpoint,
        StorageEndpoint,
        WorkerConfigEndpoint,
        HealthAlertEndpoint,
        PlatformEndpoint,
        FlowRunStatsEndpoint
    };

    constructor(private readonly apiEndpoint: string, private readonly clientId: string, private readonly clientSecret: string) {

        const options: OAuthClientOptions = new OAuthClientOptions(apiEndpoint, clientId, clientSecret, this.getHeaders());
        this.httpClient = new OAuthClient(options);

        this.endpoints = new Map<string, any>();

        // this.test = new Map<string, any>();
        //
        // this.test.set('WorkerEndpoint', WorkerEndpoint);

        // this.socketService = socketIo(this.apiEndpoint);
        //
        // this.socketService.on('message', (data: any) => {
        //     console.log('Incoming:', data);
        // });
    }

    private getHeaders(): { [key: string]: string | string[] } {
        const userAgentInfo: { version: string; language: string; language_version: string; publisher: string } = {
            version: VERSION,
            language: 'Javascript',
            language_version: '',
            publisher: 'Attlaz'
        }
        return {
            'User-Agent': 'Attlaz Javascript Client/' + VERSION,
            'X-Attlaz-Client-User-Agent': JSON.stringify(userAgentInfo)
        }
    }

    public getHttpClient(): OAuthClient {
        return this.httpClient;
    }

    public async authenticate(): Promise<boolean>;
    public async authenticate(username: string, password: string): Promise<boolean>;

    public async authenticate(username: string | null = null, password: string | null = null): Promise<boolean> {
        if (username === null || password === null) {
            return this.httpClient.authenticate();
        }
        return this.httpClient.authenticate(username, password);
    }

    public isAuthenticated(): boolean {
        return this.httpClient.isAuthenticated();
    }

    public getToken(): OAuthClientToken | null {
        return this.httpClient.getToken();
    }

    // public getAccessToken(): string {
    //     return this.httpClient.getAccessToken();
    // }
    //
    public setToken(token: OAuthClientToken): void {
        this.httpClient.setToken(token);
    }

    //
    // public x(accessToken: string, refreshToken: string): Promise<Token> {
    //     return this.httpClient.refreshToken(accessToken, refreshToken);
    // }

    public unsetAccessToken(): void {
        this.httpClient.unsetToken();
    }

    public async getApiInformation(): Promise<{ version: string }> {
        const result: { version: string } = await this.httpClient.request('/system/health', null, 'GET', false);
        return {version: result.version};
    }

    /* Endpoints */
    public getAdapterEndpoint(): AdapterEndpoint {
        return this.getEndpoint('adapter', this.Store.AdapterEndpoint);
    }

    public getProjectEndpoint(): ProjectEndpoint {
        return this.getEndpoint('project', this.Store.ProjectEndpoint);
    }

    public getProjectEnvironmentEndpoint(): ProjectEnvironmentEndpoint {
        return this.getEndpoint('projectenvironment', this.Store.ProjectEnvironmentEndpoint);
    }

    public getProjectDeployEndpoint(): ProjectDeployEndpoint {
        return this.getEndpoint('projectdeploy', this.Store.ProjectDeployEndpoint);
    }

    public getChannelEndpoint(): ChannelEndpoint {
        return this.getEndpoint('channel', this.Store.ChannelEndpoint);
    }

    public getConfigEndpoint(): ConfigEndpoint {
        return this.getEndpoint('config', this.Store.ConfigEndpoint);
    }

    public getNotificationsEndpoint(): NotificationsEndpoint {
        return this.getEndpoint('notification', this.Store.NotificationsEndpoint);
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
        return this.getEndpoint('task', this.Store.FlowEndpoint);
    }

    public getFlowRunEndpoint(): FlowRunEndpoint {
        return this.getEndpoint('flowrun', this.Store.FlowRunEndpoint);
    }

    public getFlowRunRequestEndpoint(): FlowRunRequestEndpoint {
        return this.getEndpoint('flowrunrequest', this.Store.FlowRunRequestEndpoint);
    }

    public getTaskExecutionStatsEndpoint(): FlowRunStatsEndpoint {
        return this.getEndpoint('flowrunstats', this.Store.FlowRunStatsEndpoint);
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

    public getWorkerEndpoint(): WorkerEndpoint {
        return this.getEndpoint('worker', this.Store.WorkerEndpoint);
    }

    public getSourcesAccountEndpoint(): SourcesAccountEndpoint {
        return this.getEndpoint('sourcesaccount', this.Store.SourcesAccountEndpoint);
    }

    public getLanguageEndpoint(): PlatformLanguageEndpoint {
        return this.getEndpoint('language', this.Store.PlatformLanguageEndpoint);
    }

    public getStorageEndpoint(): StorageEndpoint {
        return this.getEndpoint('storage', this.Store.StorageEndpoint);
    }

    public getWorkerConfigEndpoint(): WorkerConfigEndpoint {
        return this.getEndpoint('workerconfig', this.Store.WorkerConfigEndpoint);
    }

    public getQueueEndpoint(): QueueEndpoint {
        return this.getEndpoint('queue', this.Store.QueueEndpoint);
    }

    public getHealthAlertEndpoint(): HealthAlertEndpoint {
        return this.getEndpoint('healtalert', this.Store.HealthAlertEndpoint);
    }

    private getEndpoint<T extends Endpoint>(key: string, className: { new(x: OAuthClient): T; }): T {

        //const classNameString: string = className.name;

        if (!this.endpoints.has(key)) {
            // if (this.Store[classNameString] === undefined || this.Store[classNameString] === null) {
            //     throw new Error(`Class type of \'${classNameString}\' is not in the store`);
            // }
            try {
                const endpoint: Endpoint = new className(this.httpClient);
                this.endpoints.set(key, endpoint);
            } catch (e: any) {
                throw new Error('Unable to initialize ' + key + ' endpoint (' + e.message + ')');
            }

        }
        return this.endpoints.get(key);
    }

}
