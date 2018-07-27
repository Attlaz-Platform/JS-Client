import {OptionsWithUri} from "request-promise-native";

const request = require('request-promise-native');

export class HttpClient {
    private apiEndpoint: string = 'https://api2.attlaz.com/';
    private clientId: string;
    private clientSecret: string;
    private accessToken: string;

    private debug: boolean = false;

    // private socketService;

    constructor(apiEndpoint: string, clientId: string, clientSecret: string) {
        this.apiEndpoint = apiEndpoint;
        this.clientId = clientId;
        this.clientSecret = clientSecret;

    }

    public authenticate(username: string, password: string): Promise<boolean> {
        //TODO: should we encrypt the password in the client?

        return new Promise<boolean>((resolve, reject) => {
            this.requestToken(username, password).then((success: boolean) => {
                resolve(success);

            }).catch((err: Error) => {
                reject(err);
            });
        });

    }

    private getUri(method: string): string {
        return this.apiEndpoint.replace(/\/+$/, "") + '/' + method.replace(/^\/+/g, '');
    }

    private requestToken(username: string, password: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {

            let body: any = {
                grant_type: 'password',
                username: username,
                password: password
            };
            let options: any = {
                url: this.getUri('oauth/token'),
                method: 'POST',
                headers: {
                    'Authorization': 'Basic ' + Buffer.from(this.clientId + ':' + this.clientSecret).toString('base64'),
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                json: true,

                form: body
            };

            if (this.debug) {
                console.info('Get token');
            }
            request(options).then((content: any) => {
                //TODO: check if properties exist in response
                this.accessToken = content.access_token;
                //let refresh_token: string = content.refresh_token;

                resolve(true);

            }).catch((err: Error) => {

                if (this.debug) {
                    console.error('Unable to get token:', err.message);
                }

                reject(err);
            });

        });
    }

    public request(action: string, parameters: any = [], method: string = 'GET'): Promise<any> {

        return new Promise<any>((resolve, reject) => {

            if (!this.isAuthenticated()) {
                reject(new Error('Unable to perform request, access token not provided'));
            }
            else {
                // console.log('token loaded');
                let options: OptionsWithUri = <OptionsWithUri>{
                    uri: this.getUri(action),
                    method: method,
                    headers: {
                        'Authorization': 'Bearer ' + this.accessToken,
                        'Content-Type': 'application/json'
                    },
                    json: true,

                };

                if (method === 'POST') {
                    options.body = parameters;
                }

                if (this.debug) {
                    console.info('[Attlaz Client] ' + method + ": " + action);
                }

                request(options).then((content: any) => {

                    resolve(content);

                }).catch((err: Error) => {

                    if (this.debug) {
                        console.error('Unable to get data: ', err);
                    }

                    reject(err);
                });
            }

        });
    }

    public isAuthenticated(): boolean {
        //TODO: other ways to determine if the client is authenticated?
        return this.accessToken !== undefined && this.accessToken !== '';
    }

    public getAccessToken(): string {
        return this.accessToken;
    }

    public setAccessToken(accessToken: string) {
        this.accessToken = accessToken;
    }

    public enableDebug() {
        this.debug = true;
    }

    public disableDebug() {
        this.debug = false;
    }

    public isDebugEnabled(): boolean {
        return this.debug;
    }

}