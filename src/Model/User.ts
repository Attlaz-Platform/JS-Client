import {Utils} from '../Utils';
import {State} from './State';
import {StateAware} from './StateAware';

export class User implements StateAware {
    public id: string;
    public username: string;
    public firstname: string;
    public lastname: string;
    public email: string;
    public phone: string;

    public password: string;

    public language: string;
    public time_zone: string;
    public date_format: string;
    public time_format: string;
    public picture: string;

    public state: State = State.Active;

    public last_active: Date | null = null;

    public static parse(rawUser: any): User {
        let user: User = new User();
        user.id = rawUser.id;
        user.username = rawUser.username;
        user.firstname = rawUser.firstname;
        user.lastname = rawUser.lastname;
        user.email = rawUser.email;
        user.phone = rawUser.phone;
        user.language = rawUser.language;
        user.time_zone = rawUser.time_zone;
        user.date_format = rawUser.date_format;
        user.time_format = rawUser.time_format;
        user.picture = rawUser.picture;
        user.state = State.fromString(rawUser.state);
        if (rawUser.last_active !== null && rawUser.last_active !== undefined) {
            user.last_active = Utils.parseRawDate(rawUser.last_active);
        }
        return user;
    }
}
