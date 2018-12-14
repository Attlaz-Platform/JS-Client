import * as ClientOAuth2 from 'client-oauth2';
import {Token} from 'client-oauth2';

import * as Popsicle from 'popsicle';
// import {Response} from 'popsicle/dist/response';
// import request = require('request-promise-native');
import {Request, Response} from 'servie';

// const Request = require('request-promise-native');

export class HttpClient {
    private apiEndpoint: string;
    private clientId: string;
    private clientSecret: string;

    private debug: boolean = false;

    private oauthClient: ClientOAuth2;

    private oauthToken: Token;

    constructor(apiEndpoint: string, clientId: string, clientSecret: string) {
        this.apiEndpoint = apiEndpoint;
        this.clientId = clientId;
        this.clientSecret = clientSecret;

        this.oauthClient = new ClientOAuth2({
            clientId: clientId,
            clientSecret: clientSecret,
            accessTokenUri: this.getUri('oauth/token'),
            authorizationUri: this.getUri('oauth/authorize'),
            redirectUri: 'http://example.com/auth/github/callback',
            scopes: ['all'],
            state: 'xyz'
        });

    }

    public authenticate(username: string, password: string): Promise<boolean>;
    public authenticate(): Promise<boolean>;

    public authenticate(username?: string, password?: string): Promise<boolean> {
        //TODO: should we encrypt the password in the client (or is https save enough)?

        return new Promise<boolean>((resolve, reject) => {

            if (username !== null && username !== undefined && password !== null && password !== undefined) {
                this.oauthClient.owner.getToken(username, password).then((token: Token) => {
                    this.oauthToken = token;
                    resolve(true);

                }).catch((err: Error) => {
                    reject(err);
                });
            } else {
                this.oauthClient.credentials.getToken().then((token: Token) => {
                    this.oauthToken = token;
                    resolve(true);

                }).catch((err: Error) => {
                    reject(err);
                });
            }

        });

    }

    private getUri(method: string): string {
        return this.apiEndpoint.replace(/\/+$/, "") + '/' + method.replace(/^\/+/g, '');
    }

    public request(action: string, parameters: any = [], method: string = 'GET'): Promise<any> {

        return new Promise<any>((resolve, reject) => {

                if (!this.isAuthenticated()) {
                    reject(new Error('Unable to perform request, access token not provided'));
                } else {

                    const url: string = this.getUri(action);

                    let requestData: any = {
                        method: method,
                        url: url,

                    };

                    if (method === 'POST') {
                        requestData.body = parameters;
                    }

                    let signedRequestData: any = this.oauthToken.sign(requestData);

                    //console.log('Signed', signedRequestData);

                    const request: Request = Popsicle.request(signedRequestData.url, signedRequestData);
                    request.headers.append("Content-Type", "application/json");

                    if (this.debug) {
                        console.info('[Attlaz Client request] ', request.toJSON());
                    }

                    Popsicle.transport({negotiateHttpVersion: 0})(request).then((response: Response) => {

                        switch (response.statusCode) {
                            case 401:
                                //Unauthorized
                                console.error(response.statusMessage);
                                reject('Unauthorized');
                                break;
                        }

                        // (response.body.text().then((body: any) => {
                        //     console.log('Body: ', body);
                        // })).catch((err: Error) => {
                        //     console.error(err);
                        //     // if (this.debug) {
                        //     //     console.error('Unable to get data: ', err);
                        //     // }
                        //     // reject(err);
                        // });
                        //TODO: validate status
                        requestData = null;
                        signedRequestData = null;

                        //console.log(response);
                        (response.body.json().then((body: any) => {
                            resolve(body);
                        })).catch((err: Error) => {
                            if (this.debug) {
                                console.error('Unable to get data: ', err);
                            }
                            reject(err);
                        });

                    }).catch((err: Error) => {

                        if (this.debug) {
                            console.error('Unable to get data: ', err);
                        }

                        reject(err);
                    });
                }

            }
        );
    }

    public isAuthenticated(): boolean {
        //TODO: other ways to determine if the client is authenticated?
        return this.oauthToken !== null && this.oauthToken !== undefined;
    }

    public getAccessToken(): string {
        return this.oauthToken.accessToken;
    }

    public setAccessToken(accessToken: string) {
        this.oauthToken = this.oauthClient.createToken(accessToken, {});
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