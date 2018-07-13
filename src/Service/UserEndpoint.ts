import {Endpoint, User} from "..";

export class UserEndpoint extends Endpoint {

    public getUser(): Promise<User> {

        return new Promise<User>((resolve, reject) => {

            let cmd: string = '/user';

            this.httpClient.request(cmd).then((rawUser: any) => {

                resolve(User.parse(rawUser));

            }).catch((reason) => {
                if (this.httpClient.isDebugEnabled()) {
                    console.error('Unable to get user: ', reason);
                }

                reject(reason);
            });

        });
    }
}