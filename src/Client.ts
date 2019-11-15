import {
    AdapterEndpoint,
    ConfigEndpoint,
    Endpoint,
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
import {WorkerEndpoint} from './Service/WorkerEndpoint';

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
        SystemEndpoint,
        TaskEndpoint,
        TaskExecutionEndpoint,
        TaskExecutionRequestEndpoint,
        TeamsEndpoint,
        TriggerEndpoint,
        UserEndpoint
    };

    private httpClient: HttpClient;

    // private socketService;

    constructor(private apiEndpoint: string, private  clientId: string, private clientSecret: string) {

        this.httpClient = new HttpClient(apiEndpoint, clientId, clientSecret);

        this.endpoints = new Map<string, any>();
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
        return this.getEndpoint(this.Store.AdapterEndpoint);
    }

    public getProjectEndpoint(): ProjectEndpoint {
        return this.getEndpoint(this.Store.ProjectEndpoint);
    }

    public getProjectEnvironmentEndpoint(): ProjectEnvironmentEndpoint {
        return this.getEndpoint(this.Store.ProjectEnvironmentEndpoint);
    }

    public getProjectDeployEndpoint(): ProjectDeployEndpoint {
        return this.getEndpoint(this.Store.ProjectDeployEndpoint);
    }

    public getChannelEndpoint(): ChannelEndpoint {
        return this.getEndpoint(this.Store.ChannelEndpoint);
    }

    public getConfigEndpoint(): ConfigEndpoint {
        return this.getEndpoint(this.Store.ConfigEndpoint);
    }

    public getNotificationsEndpoint(): NotificationsEndpoint {
        return this.getEndpoint(this.Store.NotificationsEndpoint);
    }

    public getSubscriberEndpoint(): SubscriberEndpoint {
        return this.getEndpoint(this.Store.SubscriberEndpoint);
    }

    public getSystemEndpoint(): SystemEndpoint {
        return this.getEndpoint(this.Store.SystemEndpoint);
    }

    public getTaskEndpoint(): TaskEndpoint {
        return this.getEndpoint(this.Store.TaskEndpoint);
    }

    public getTaskExecutionEndpoint(): TaskExecutionEndpoint {
        return this.getEndpoint(this.Store.TaskExecutionEndpoint);
    }

    public getTaskExecutionRequestEndpoint(): TaskExecutionRequestEndpoint {
        return this.getEndpoint(this.Store.TaskExecutionRequestEndpoint);
    }

    public getTeamsEndpoint(): TeamsEndpoint {
        return this.getEndpoint(this.Store.TeamsEndpoint);
    }

    public getTriggerEndpoint(): TriggerEndpoint {
        return this.getEndpoint(this.Store.TriggerEndpoint);
    }

    public getUserEndpoint(): UserEndpoint {
        return this.getEndpoint(this.Store.UserEndpoint);
    }

    public getWorkerEndpoint(): WorkerEndpoint {
        return this.getEndpoint(this.Store.WorkerEndpoint);
    }

    private getEndpoint<T extends Endpoint>(className: { new(x: HttpClient): T; }): T {

        const classNameString: string = className.name;

        if (!this.endpoints.has(classNameString)) {
            if (this.Store[classNameString] === undefined || this.Store[classNameString] === null) {
                throw new Error(`Class type of \'${classNameString}\' is not in the store`);
            }

            const endpoint: Endpoint = new className(this.httpClient);
            this.endpoints.set(classNameString, endpoint);
        }
        return this.endpoints.get(classNameString);
    }

}
