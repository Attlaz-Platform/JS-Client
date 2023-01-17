import {State} from './State';
import {StateAware} from './StateAware';

export class User implements StateAware {
    public id: string;
    public name: string;
    public emailIsVerified: boolean;
    public email: string;
    public phone: string;

    public password: string;

    public language: string;
    public time_zone: string;
    public date_format: string;
    public time_format: string;
    public picture: string;
    public state: State = State.Active;

    public static parse(rawUser: any): User {
        let user: User = new User();
        user.id = rawUser.id;
        user.name = rawUser.name;
        user.email = rawUser.email;
        user.emailIsVerified = rawUser.email_is_verified;
        user.phone = rawUser.phone;
        user.language = rawUser.language;
        user.time_zone = rawUser.time_zone;
        user.date_format = rawUser.date_format;
        user.time_format = rawUser.time_format;
        user.picture = rawUser.picture;
        user.state = State.fromString(rawUser.state);

        return user;
    }
}
