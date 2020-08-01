import {
    AdapterEndpoint,
    ChannelEndpoint,
    ConfigEndpoint,
    Endpoint,
    LanguageEndpoint,
    LogEndpoint,
    MemberEndpoint,
    NotificationsEndpoint,
    OAuthClient,
    OAuthClientOptions,
    ProjectEndpoint,
    SubscriberEndpoint,
    TaskEndpoint,
    TaskExecutionEndpoint,
    TaskExecutionRequestEndpoint,
    TeamsEndpoint,
    TriggerEndpoint,
    UserEndpoint,
    ProjectEnvironmentEndpoint,
    ProjectDeployEndpoint,
    WorkerEndpoint,
    SourcesAccountEndpoint
} from ".";



export class Client {

    private endpoints: Map<string, any>;

    private Store: any = {
        WorkerEndpoint,
        AdapterEndpoint,
        ProjectEndpoint,
        ProjectEnvironmentEndpoint,
        ProjectDeployEndpoint,
        ChannelEndpoint,
        ConfigEndpoint,
        NotificationsEndpoint,
        SubscriberEndpoint,
        LogEndpoint,
        TaskEndpoint,
        TaskExecutionEndpoint,
        TaskExecutionRequestEndpoint,
        TeamsEndpoint,
        TriggerEndpoint,
        UserEndpoint,
        MemberEndpoint,
        SourcesAccountEndpoint,
        LanguageEndpoint,
    };

    private httpClient: OAuthClient;

    // private test: Map<string, any>;

    // private socketService;

    constructor(private apiEndpoint: string, private  clientId: string, private clientSecret: string) {

        const options: OAuthClientOptions = new OAuthClientOptions(apiEndpoint, clientId, clientSecret);
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

    public getHttpClient(): OAuthClient {
        return this.httpClient;
    }

    public authenticate(): Promise<boolean>;
    public authenticate(username: string, password: string): Promise<boolean>;

    public authenticate(username?: string, password?: string): Promise<boolean> {
        return this.httpClient.authenticate(username, password);

    }

    public isAuthenticated(): boolean {
        return this.httpClient.isAuthenticated();
    }

    public getAccessToken(): string {
        return this.httpClient.getAccessToken();
    }

    public setAccessToken(accessToken: string): void {
        this.httpClient.setAccessToken(accessToken);
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
        return this.getEndpoint('notiication', this.Store.NotificationsEndpoint);
    }

    public getSubscriberEndpoint(): SubscriberEndpoint {
        return this.getEndpoint('subscriber', this.Store.SubscriberEndpoint);
    }

    public getLogEndPoint(): LogEndpoint {
        return this.getEndpoint('log', this.Store.LogEndpoint);
    }

    public getTaskEndpoint(): TaskEndpoint {
        return this.getEndpoint('task', this.Store.TaskEndpoint);
    }

    public getTaskExecutionEndpoint(): TaskExecutionEndpoint {
        return this.getEndpoint('taskexecution', this.Store.TaskExecutionEndpoint);
    }

    public getTaskExecutionRequestEndpoint(): TaskExecutionRequestEndpoint {
        return this.getEndpoint('taskexecutionrequest', this.Store.TaskExecutionRequestEndpoint);
    }

    public getTeamsEndpoint(): TeamsEndpoint {
        return this.getEndpoint('teams', this.Store.TeamsEndpoint);
    }

    public getTriggerEndpoint(): TriggerEndpoint {
        return this.getEndpoint('trigger', this.Store.TriggerEndpoint);
    }

    public getUserEndpoint(): UserEndpoint {
        return this.getEndpoint('user', this.Store.UserEndpoint);
    }

    public getMemberEndpoint(): MemberEndpoint {
        return this.getEndpoint('member', this.Store.MemberEndpoint);
    }

    public getWorkerEndpoint(): WorkerEndpoint {
        return this.getEndpoint('worker', this.Store.WorkerEndpoint);
    }

    public getSourcesAccountEndpoint(): SourcesAccountEndpoint {
        return this.getEndpoint('sourcesaccount', this.Store.SourcesAccountEndpoint);
    }

    public getLanguageEndpoint(): LanguageEndpoint {
        return this.getEndpoint('language', this.Store.LanguageEndpoint);
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
            } catch (e) {
                throw new Error('Unable to initialize ' + key + ' endpoint (' + e.message + ')');
            }

        }
        return this.endpoints.get(key);
    }

}
