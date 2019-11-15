import {
    AdapterEndpoint,
    ConfigEndpoint,
    HttpClient,
    NotificationsEndpoint,
    ProjectEndpoint,
    SubscriberEndpoint,
    SystemEndpoint,
    TaskEndpoint,
    TaskExecutionEndpoint,
    TaskExecutionRequestEndpoint,
    TeamsEndpoint,
    TriggerEndpoint,
    UserEndpoint
} from ".";
import {ChannelEndpoint} from './Service/ChannelEndpoint';
import {ProjectEnvironmentEndpoint} from './Service/ProjectEnvironmentEndpoint';
import {ProjectDeployEndpoint} from './Service/ProjectDeployEndpoint';
import {ParseHelper} from './Helper/ParseHelper';

export class Client {
    private apiEndpoint: string;
    private clientId: string;
    private clientSecret: string;

    private adapterEndpoint: AdapterEndpoint;
    private projectEndpoint: ProjectEndpoint;
    private projectEnvironmentEndpoint: ProjectEnvironmentEndpoint;
    private projectDeployEndpoint: ProjectDeployEndpoint;
    private channelEndpoint: ChannelEndpoint;
    private configEndpoint: ConfigEndpoint;
    private notificationsEndpoint: NotificationsEndpoint;
    private subscriberEndpoint: SubscriberEndpoint;
    private systemEndpoint: SystemEndpoint;
    private taskEndpoint: TaskEndpoint;
    private taskExecutionEndpoint: TaskExecutionEndpoint;
    private taskExecutionRequestEndpoint: TaskExecutionRequestEndpoint;
    private teamsEndpoint: TeamsEndpoint;
    private triggerEndpoint: TriggerEndpoint;
    private userEndpoint: UserEndpoint;

    private httpClient: HttpClient;

    // private socketService;

    constructor(apiEndpoint: string, clientId: string, clientSecret: string) {
        this.apiEndpoint = apiEndpoint;
        this.clientId = clientId;
        this.clientSecret = clientSecret;

        this.httpClient = new HttpClient(apiEndpoint, clientId, clientSecret);

        // this.socketService = socketIo(this.apiEndpoint);
        //
        // this.socketService.on('message', (data: any) => {
        //     console.log('Incoming:', data);
        // });
    }

    public getHttpClient(): HttpClient {
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

        if (ParseHelper.isNullOrUndefined(this.adapterEndpoint)) {
            this.adapterEndpoint = new AdapterEndpoint(this.httpClient);
        }

        return this.adapterEndpoint;
    }

    public getProjectEndpoint(): ProjectEndpoint {

        if (ParseHelper.isNullOrUndefined(this.projectEndpoint)) {
            this.projectEndpoint = new ProjectEndpoint(this.httpClient);
        }

        return this.projectEndpoint;
    }

    public getProjectEnvironmentEndpoint(): ProjectEnvironmentEndpoint {

        if (ParseHelper.isNullOrUndefined(this.projectEnvironmentEndpoint)) {
            this.projectEnvironmentEndpoint = new ProjectEnvironmentEndpoint(this.httpClient);
        }

        return this.projectEnvironmentEndpoint;
    }

    public getProjectDeployEndpoint(): ProjectDeployEndpoint {

        if (ParseHelper.isNullOrUndefined(this.projectDeployEndpoint)) {
            this.projectDeployEndpoint = new ProjectDeployEndpoint(this.httpClient);
        }

        return this.projectDeployEndpoint;
    }

    public getChannelEndpoint(): ChannelEndpoint {

        if (ParseHelper.isNullOrUndefined(this.channelEndpoint)) {
            this.channelEndpoint = new ChannelEndpoint(this.httpClient);
        }

        return this.channelEndpoint;
    }

    public getConfigEndpoint(): ConfigEndpoint {
        if (ParseHelper.isNullOrUndefined(this.configEndpoint)) {
            this.configEndpoint = new ConfigEndpoint(this.httpClient);
        }
        return this.configEndpoint;
    }

    public getNotificationsEndpoint(): NotificationsEndpoint {
        if (ParseHelper.isNullOrUndefined(this.notificationsEndpoint)) {
            this.notificationsEndpoint = new NotificationsEndpoint(this.httpClient);
        }
        return this.notificationsEndpoint;
    }

    public getSubscriberEndpoint(): SubscriberEndpoint {
        if (ParseHelper.isNullOrUndefined(this.subscriberEndpoint)) {
            this.subscriberEndpoint = new SubscriberEndpoint(this.httpClient);
        }
        return this.subscriberEndpoint;
    }

    public getSystemEndpoint(): SystemEndpoint {
        if (ParseHelper.isNullOrUndefined(this.systemEndpoint)) {
            this.systemEndpoint = new SystemEndpoint(this.httpClient);
        }
        return this.systemEndpoint;
    }

    public getTaskEndpoint(): TaskEndpoint {
        if (ParseHelper.isNullOrUndefined(this.taskEndpoint)) {
            this.taskEndpoint = new TaskEndpoint(this.httpClient);
        }
        return this.taskEndpoint;
    }

    public getTaskExecutionEndpoint(): TaskExecutionEndpoint {
        if (ParseHelper.isNullOrUndefined(this.taskExecutionEndpoint)) {
            this.taskExecutionEndpoint = new TaskExecutionEndpoint(this.httpClient);
        }
        return this.taskExecutionEndpoint;
    }

    public getTaskExecutionRequestEndpoint(): TaskExecutionRequestEndpoint {
        if (ParseHelper.isNullOrUndefined(this.taskExecutionRequestEndpoint)) {
            this.taskExecutionRequestEndpoint = new TaskExecutionRequestEndpoint(this.httpClient);
        }
        return this.taskExecutionRequestEndpoint;
    }

    public getTeamsEndpoint(): TeamsEndpoint {
        if (ParseHelper.isNullOrUndefined(this.teamsEndpoint)) {
            this.teamsEndpoint = new TeamsEndpoint(this.httpClient);
        }
        return this.teamsEndpoint;
    }

    public getTriggerEndpoint(): TriggerEndpoint {
        if (ParseHelper.isNullOrUndefined(this.triggerEndpoint)) {
            this.triggerEndpoint = new TriggerEndpoint(this.httpClient);
        }
        return this.triggerEndpoint;
    }

    public getUserEndpoint(): UserEndpoint {
        if (ParseHelper.isNullOrUndefined(this.userEndpoint)) {
            this.userEndpoint = new UserEndpoint(this.httpClient);
        }
        return this.userEndpoint;
    }

}
