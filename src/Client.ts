import {OAuthClientOptions} from './Http/OAuthClientOptions.js';
import {OAuthClientToken} from './Http/OAuthClientToken.js';
import {ITransport, ParseErrorHandler} from './Http/Transport/ITransport.js';
import {OAuthClient, TokenChangeHandler} from './Http/Transport/OAuthClient.js';
import {AccessTokenEndpoint} from './Service/AccessTokenEndpoint.js';
import {AdapterConnectionEndpoint} from './Service/AdapterConnectionEndpoint.js';
import {ConnectionBundleEndpoint} from './Service/ConnectionBundleEndpoint.js';
import {McpAccessEndpoint} from './Service/McpAccessEndpoint.js';
import {AdapterEndpoint} from './Service/AdapterEndpoint.js';
import {ChannelEndpoint} from './Service/ChannelEndpoint.js';
import {CodeDeployEndpoint} from './Service/CodeDeployEndpoint.js';
import {CodeSourceStrategiesEndpoint} from './Service/CodeSourceStrategiesEndpoint.js';
import {CollectionsEndpoint} from './Service/CollectionsEndpoint.js';
import {ComponentEndpoint} from './Service/ComponentEndpoint.js';
import {CommandExecutionEndpoint} from './Service/CommandExecutionEndpoint.js';
import {ConfigEndpoint} from './Service/ConfigEndpoint.js';
import {ConfigurationEndpoint} from './Service/ConfigurationEndpoint.js';
import {Endpoint} from './Service/Endpoint.js';
import {FirewallEndpoint} from './Service/FirewallEndpoint.js';
import {FlowEndpoint} from './Flow/Service/FlowEndpoint.js';
import {FlowRunEndpoint} from './Flow/Service/FlowRunEndpoint.js';
import {FlowRunRequestEndpoint} from './Flow/Service/FlowRunRequestEndpoint.js';
import {FlowRunStatsEndpoint} from './Flow/Service/FlowRunStatsEndpoint.js';
import {HealthAlertEndpoint} from './Service/HealthAlertEndpoint.js';
import {InboxEndpoint} from './Service/InboxEndpoint.js';
import {LogEndpoint} from './Logging/Service/LogEndpoint.js';
import {PlatformEndpoint} from './Service/PlatformEndpoint.js';
import {TimezoneEndpoint} from './Service/TimezoneEndpoint.js';
import {PlatformLanguageEndpoint} from './Service/PlatformLanguageEndpoint.js';
import {ProjectEndpoint} from './Service/ProjectEndpoint.js';
import {ProjectEnvironmentEndpoint} from './Service/ProjectEnvironmentEndpoint.js';
import {ProviderTokenEndpoint} from './Service/ProviderTokenEndpoint.js';
import {VendorProductEndpoint} from './MarketPulse/Service/VendorProductEndpoint.js';
import {CrawlJobEndpoint} from './MarketPulse/Service/CrawlJobEndpoint.js';
import {CatalogEndpoint} from './Catalog/Service/CatalogEndpoint.js';
import {ProductMatchJobEndpoint} from './MarketPulse/Service/ProductMatchJobEndpoint.js';
import {IndexJobEndpoint} from './MarketPulse/Service/IndexJobEndpoint.js';
import {ProductMatchEndpoint} from './MarketPulse/Service/ProductMatchEndpoint.js';
import {PulseCatalogProductEndpoint} from './MarketPulse/Service/PulseCatalogProductEndpoint.js';
import {PriceAlertEndpoint} from './MarketPulse/Service/PriceAlertEndpoint.js';
import {PricingEndpoint} from './MarketPulse/Service/PricingEndpoint.js';
import {OpportunityEndpoint} from './MarketPulse/Service/OpportunityEndpoint.js';
import {ProductGroupEndpoint} from './MarketPulse/Service/ProductGroupEndpoint.js';
import {CatalogProductEndpoint} from './Catalog/Service/CatalogProductEndpoint.js';
import {GenerateContentEndpoint} from './DataEnrichment/Service/GenerateContentEndpoint.js';
import {CompetitorEndpoint} from './MarketPulse/Service/CompetitorEndpoint.js';
import {VendorEndpoint} from './MarketPulse/Service/VendorEndpoint.js';
import {PulseStatisticsEndpoint} from './MarketPulse/Service/PulseStatisticsEndpoint.js';
import {QualityEndpoint} from './DataQuality/Service/QualityEndpoint.js';
import {CatalogFeedEndpoint} from './FeedManagement/Service/CatalogFeedEndpoint.js';
import {RunnerEndpoint} from './Service/RunnerEndpoint.js';
import {RunnerPoolEndpoint} from './Service/RunnerPoolEndpoint.js';
import {SearchEndpoint} from './Service/SearchEndpoint.js';
import {SourcesAccountEndpoint} from './Service/SourcesAccountEndpoint.js';
import {StorageEndpoint} from './Service/StorageEndpoint.js';
import {SubscriberEndpoint} from './Service/SubscriberEndpoint.js';
import {TriggerEndpoint} from './Service/TriggerEndpoint.js';
import {UserActionEndpoint} from './Service/UserActionEndpoint.js';
import {UserEndpoint} from './Service/UserEndpoint.js';
import {WorkspaceEndpoint} from './Service/WorkspaceEndpoint.js';
import {WorkspaceMemberEndpoint} from './Service/WorkspaceMemberEndpoint.js';
import {VERSION} from './version.js';

export class Client {
    private readonly endpoints: Map<string, Endpoint> = new Map();
    private httpClient: OAuthClient;
    private transport: ITransport;
    private readonly Store = {
        AccessTokenEndpoint,
        AdapterConnectionEndpoint,
        AdapterEndpoint,
        ConnectionBundleEndpoint,
        McpAccessEndpoint,
        ChannelEndpoint,
        CodeDeployEndpoint,
        ComponentEndpoint,
        CodeSourceStrategiesEndpoint,
        CommandExecutionEndpoint,
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
        TimezoneEndpoint,
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
        RunnerPoolEndpoint,
        ProviderTokenEndpoint,
        VendorProductEndpoint,
        CrawlJobEndpoint,
        CatalogEndpoint,
        ProductMatchJobEndpoint,
        IndexJobEndpoint,
        ProductMatchEndpoint,
        PulseCatalogProductEndpoint,
        PriceAlertEndpoint,
        PricingEndpoint,
        OpportunityEndpoint,
        ProductGroupEndpoint,
        CatalogProductEndpoint,
        GenerateContentEndpoint,
        CompetitorEndpoint,
        VendorEndpoint,
        PulseStatisticsEndpoint,
        QualityEndpoint,
        CatalogFeedEndpoint,
    };

    private readonly apiEndpoint: string = 'https://api.attlaz.com';

    constructor(token: string | null = null, config: { apiEndpoint?: string } = {}) {
        if (config.apiEndpoint !== undefined) {
            this.apiEndpoint = config.apiEndpoint;
        }

        const options: OAuthClientOptions = new OAuthClientOptions(this.apiEndpoint);
        this.httpClient = new OAuthClient(options);
        // An empty string is not a token — treat it as "no token" so callers like `new Client('')`
        // (public/credentials clients that set the real token later) don't carry a bogus empty token.
        if (token !== null && token !== '') {
            const clientToken: OAuthClientToken = new OAuthClientToken(token, 'Bearer', '', '');
            this.httpClient.setToken(clientToken);
        }

        this.transport = this.httpClient;
    }

    /**
     * Create a Client that uses a custom transport instead of OAuth.
     * Intended for internal service-to-service calls (e.g. using DirectTransport).
     */
    public static withTransport(transport: ITransport, config: {
        apiEndpoint: string | undefined
    } = {apiEndpoint: undefined}): Client {
        const client = new Client(null, config);
        client.transport = transport;
        return client;
    }

    public setClientCredentials(clientId: string, clientSecret: string = ''): void {
        // Store the credentials in place; the token (if any) is preserved and used while valid. When
        // no valid token exists, the client mints one from these credentials on the next request.
        this.httpClient.setClientCredentials(clientId, clientSecret, ['all']);
    }

    /**
     * Configure this client as a public OAuth client (no client_secret).
     * Used for SPAs and other public clients that cannot keep a secret.
     */
    public setPublicClient(clientId: string): void {
        this.httpClient.setClientCredentials(clientId, null, ['all']);
    }

    /**
     * Overall budget for a single request. **Milliseconds** — the PHP client's `setTimeout()` takes
     * seconds, so do not port a number across without converting.
     *
     * Defaults to 80 seconds, matching the PHP client. Raise it for a large upload or download: the
     * budget covers the whole exchange, so a body big enough to take longer than this to transfer
     * is aborted by the client itself, before the server has said anything. Pass 0 to disable the
     * timeout entirely, which risks hanging the process on a stalled connection.
     */
    public setTimeout(timeoutMs: number): void {
        this.httpClient.setTimeout(timeoutMs);
    }

    public setVersion(version: string | null): void {
        this.httpClient.setVersion(version);
    }

    public getHttpClient(): OAuthClient {
        return this.httpClient;
    }

    /**
     * Set a handler for non-fatal response parse failures (schema drift). Defaults to
     * console.error; wire this to your logger / error tracker to observe drift in production
     * without breaking views. Pass null to restore the default. Set on the active transport,
     * so it applies whether the client uses OAuth or a custom transport.
     */
    public setParseErrorHandler(handler: ParseErrorHandler | null): void {
        this.transport.setParseErrorHandler(handler);
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

    /**
     * Observe tokens the client acquires or discards on its own — see {@link TokenChangeHandler}.
     * A consumer that persists the token must use this rather than reading getToken() after a call:
     * refresh tokens rotate, so a refreshed token that is not written back is replayed later and
     * rejected. Pass null to stop observing. OAuth-only; a custom transport has no token.
     */
    public setTokenChangeHandler(handler: TokenChangeHandler | null): void {
        this.httpClient.setTokenChangeHandler(handler);
    }

    public async getApiInformation(): Promise<{ version: string }> {
        const result: {
            version: string | undefined
        } = await this.httpClient.request('/system/info', null, 'GET', true);
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

    public getConnectionBundleEndpoint(): ConnectionBundleEndpoint {
        return this.getEndpoint('connection-bundle', this.Store.ConnectionBundleEndpoint);
    }

    public getMcpAccessEndpoint(): McpAccessEndpoint {
        return this.getEndpoint('mcp-access', this.Store.McpAccessEndpoint);
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

    public getTimezoneEndpoint(): TimezoneEndpoint {
        return this.getEndpoint('timezone', this.Store.TimezoneEndpoint);
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
        return this.getEndpoint('health-alert', this.Store.HealthAlertEndpoint);
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

    public getCommandExecutionEndpoint(): CommandExecutionEndpoint {
        return this.getEndpoint('commandexecution', this.Store.CommandExecutionEndpoint);
    }

    public getAccessTokenEndpoint(): AccessTokenEndpoint {
        return this.getEndpoint('accesstoken', this.Store.AccessTokenEndpoint);
    }

    public getComponentEndpoint(): ComponentEndpoint {
        return this.getEndpoint('component', this.Store.ComponentEndpoint);
    }

    public getCollectionsEndpoint(): CollectionsEndpoint {
        return this.getEndpoint('collections', this.Store.CollectionsEndpoint);
    }

    public getRunnerPoolEndpoint(): RunnerPoolEndpoint {
        return this.getEndpoint('runner_pool', this.Store.RunnerPoolEndpoint);
    }

    public getProviderTokenEndpoint(): ProviderTokenEndpoint {
        return this.getEndpoint('provider_token', this.Store.ProviderTokenEndpoint);
    }

    public getFirewallEndpoint(): FirewallEndpoint {
        return this.getEndpoint('firewall', this.Store.FirewallEndpoint);
    }

    public getVendorProductEndpoint(): VendorProductEndpoint {
        return this.getEndpoint('vendor-product', this.Store.VendorProductEndpoint);
    }

    public getCrawlJobEndpoint(): CrawlJobEndpoint {
        return this.getEndpoint('crawl-job', this.Store.CrawlJobEndpoint);
    }

    public getCatalogEndpoint(): CatalogEndpoint {
        return this.getEndpoint('catalog', this.Store.CatalogEndpoint);
    }

    public getProductMatchJobEndpoint(): ProductMatchJobEndpoint {
        return this.getEndpoint('product-match-job', this.Store.ProductMatchJobEndpoint);
    }

    public getIndexJobEndpoint(): IndexJobEndpoint {
        return this.getEndpoint('index-job', this.Store.IndexJobEndpoint);
    }

    public getProductMatchEndpoint(): ProductMatchEndpoint {
        return this.getEndpoint('product-match', this.Store.ProductMatchEndpoint);
    }

    public getPulseCatalogProductEndpoint(): PulseCatalogProductEndpoint {
        return this.getEndpoint('pulse-catalog-product', this.Store.PulseCatalogProductEndpoint);
    }

    public getCatalogProductEndpoint(): CatalogProductEndpoint {
        return this.getEndpoint('catalog-product', this.Store.CatalogProductEndpoint);
    }

    public getPriceAlertEndpoint(): PriceAlertEndpoint {
        return this.getEndpoint('price-alert', this.Store.PriceAlertEndpoint);
    }

    public getPricingEndpoint(): PricingEndpoint {
        return this.getEndpoint('pricing', this.Store.PricingEndpoint);
    }

    public getOpportunityEndpoint(): OpportunityEndpoint {
        return this.getEndpoint('opportunity', this.Store.OpportunityEndpoint);
    }

    public getProductGroupEndpoint(): ProductGroupEndpoint {
        return this.getEndpoint('product-group', this.Store.ProductGroupEndpoint);
    }

    public getGenerateContentEndpoint(): GenerateContentEndpoint {
        return this.getEndpoint('generate-content', this.Store.GenerateContentEndpoint);
    }

    public getCompetitorEndpoint(): CompetitorEndpoint {
        return this.getEndpoint('competitor', this.Store.CompetitorEndpoint);
    }

    public getVendorEndpoint(): VendorEndpoint {
        return this.getEndpoint('vendor', this.Store.VendorEndpoint);
    }

    public getPulseStatisticsEndpoint(): PulseStatisticsEndpoint {
        return this.getEndpoint('pulse-statistics', this.Store.PulseStatisticsEndpoint);
    }

    public getQualityEndpoint(): QualityEndpoint {
        return this.getEndpoint('quality', this.Store.QualityEndpoint);
    }

    public getCatalogFeedEndpoint(): CatalogFeedEndpoint {
        return this.getEndpoint('catalog-feed', this.Store.CatalogFeedEndpoint);
    }

    private getEndpoint<T extends Endpoint>(key: string, ClassName: { new(x: ITransport): T; }): T {
        if (!this.endpoints.has(key)) {
            try {
                this.endpoints.set(key, new ClassName(this.transport));
            } catch (error: unknown) {
                const errorMsg: string = (error !== null && typeof error === 'object' && 'message' in error && typeof error.message === 'string') ? error.message : 'Unknown';
                throw new Error('Unable to initialize ' + key + ' endpoint (' + errorMsg + ')');
            }
        }
        return this.endpoints.get(key) as T;
    }

    public getVersion(): string {
        return VERSION;
    }
}
