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

    // private test: Map<string, any>;

    // private socketService;

    constructor(private apiEndpoint: string, private  clientId: string, private clientSecret: string) {

        this.httpClient = new HttpClient(apiEndpoint, clientId, clientSecret);

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

    public getSystemEndpoint(): SystemEndpoint {
        return this.getEndpoint('system', this.Store.SystemEndpoint);
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

    public getWorkerEndpoint(): WorkerEndpoint {
        return this.getEndpoint('worker', this.Store.WorkerEndpoint);
    }

    private getEndpoint<T extends Endpoint>(key: string, className: { new(x: HttpClient): T; }): T {

        //const classNameString: string = className.name;

        if (!this.endpoints.has(key)) {
            // if (this.Store[classNameString] === undefined || this.Store[classNameString] === null) {
            //     throw new Error(`Class type of \'${classNameString}\' is not in the store`);
            // }

            const endpoint: Endpoint = new className(this.httpClient);
            this.endpoints.set(key, endpoint);
        }
        return this.endpoints.get(key);
    }

}
