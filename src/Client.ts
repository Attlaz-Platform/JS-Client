import {AdapterEndpoint, BranchEndpoint, ConfigEndpoint, HttpClient, SubscriberEndpoint, SystemEndpoint, TaskEndpoint, TaskExecutionEndpoint, TaskExecutionRequestEndpoint, TriggerEndpoint, UserEndpoint} from ".";

export class Client {
    private apiEndpoint: string = 'https://api2.attlaz.com/';
    private clientId: string;
    private clientSecret: string;

    private adapterEndpoint: AdapterEndpoint;
    private branchEndpoint: BranchEndpoint;
    private configEndpoint: ConfigEndpoint;
    private subscriberEndpoint: SubscriberEndpoint;
    private systemEndpoint: SystemEndpoint;
    private taskEndpoint: TaskEndpoint;
    private taskExecutionEndpoint: TaskExecutionEndpoint;
    private taskExecutionRequestEndpoint: TaskExecutionRequestEndpoint;
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

    public authenticate(username: string, password: string): Promise<boolean> {
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

    public setBranch(branch: string): void {
        this.httpClient.setBranch(branch);
    }

    public getBranchId(): string {
        return this.httpClient.getBranchId();
    }

    /* Endpoints */
    public getAdapterEndpoint(): AdapterEndpoint {

        if (this.adapterEndpoint === null || this.adapterEndpoint === undefined) {
            this.adapterEndpoint = new AdapterEndpoint(this.httpClient);
        }

        return this.adapterEndpoint;
    }

    public getBranchEndpoint(): BranchEndpoint {

        if (this.branchEndpoint === null || this.branchEndpoint === undefined) {
            this.branchEndpoint = new BranchEndpoint(this.httpClient);
        }

        return this.branchEndpoint;
    }

    public getConfigEndpoint(): ConfigEndpoint {
        if (this.configEndpoint === null || this.configEndpoint === undefined) {
            this.configEndpoint = new ConfigEndpoint(this.httpClient);
        }
        return this.configEndpoint;
    }

    public getSubscriberEndpoint(): SubscriberEndpoint {
        if (this.subscriberEndpoint === null || this.subscriberEndpoint === undefined) {
            this.subscriberEndpoint = new SubscriberEndpoint(this.httpClient);
        }
        return this.subscriberEndpoint;
    }

    public getSystemEndpoint(): SystemEndpoint {
        if (this.systemEndpoint === null || this.systemEndpoint === undefined) {
            this.systemEndpoint = new SystemEndpoint(this.httpClient);
        }
        return this.systemEndpoint;
    }

    public getTaskEndpoint(): TaskEndpoint {
        if (this.taskEndpoint === null || this.taskEndpoint === undefined) {
            this.taskEndpoint = new TaskEndpoint(this.httpClient);
        }
        return this.taskEndpoint;
    }

    public getTaskExecutionEndpoint(): TaskExecutionEndpoint {
        if (this.taskExecutionEndpoint === null || this.taskExecutionEndpoint === undefined) {
            this.taskExecutionEndpoint = new TaskExecutionEndpoint(this.httpClient);
        }
        return this.taskExecutionEndpoint;
    }

    public getTaskExecutionRequestEndpoint(): TaskExecutionRequestEndpoint {
        if (this.taskExecutionRequestEndpoint === null || this.taskExecutionRequestEndpoint === undefined) {
            this.taskExecutionRequestEndpoint = new TaskExecutionRequestEndpoint(this.httpClient);
        }
        return this.taskExecutionRequestEndpoint;
    }

    public getTriggerEndpoint(): TriggerEndpoint {
        if (this.triggerEndpoint === null || this.triggerEndpoint === undefined) {
            this.triggerEndpoint = new TriggerEndpoint(this.httpClient);
        }
        return this.triggerEndpoint;
    }

    public getUserEndpoint(): UserEndpoint {
        if (this.userEndpoint === null || this.userEndpoint === undefined) {
            this.userEndpoint = new UserEndpoint(this.httpClient);
        }
        return this.userEndpoint;
    }

}