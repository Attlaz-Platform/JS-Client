import {User,Endpoint} from "..";

export class UserEndpoint extends Endpoint {

    public getUser(): Promise<User> {

        return new Promise<User>((resolve, reject) => {

            let cmd: string = '/user';

            this.httpClient.request(cmd).then((rawUser: any) => {

                resolve(rawUser);

            }).catch((reason) => {
                console.log('Unable to get user: ', reason);
                reject(reason);
            });

        });
    }
}