import {StateAware} from '../StateAware.js';
import {State} from '../State.js';
import {ApiRecord} from '../ApiRecord.js';

export class User implements StateAware {
    public id: string;

    public name: string;

    public emailIsVerified: boolean;
    public email: string;

    public phone: string;

    public language: string;
    public time_zone: string;

    public locale: string;

    public date_format: string | null = null;
    public time_format: string | null = null;
    public number_format: string | null = null;

    public picture: string;

    public state: State = State.Active;

    public static parse(rawUser: ApiRecord): User {
        const user: User = new User();
        user.id = rawUser.id as string;
        user.name = rawUser.name as string;
        user.email = rawUser.email as string;
        user.emailIsVerified = rawUser.email_is_verified as boolean;
        user.phone = rawUser.phone as string;
        user.language = rawUser.language as string;
        user.time_zone = rawUser.time_zone as string;

        user.locale = rawUser.locale as string;
        user.date_format = rawUser.date_format as string | null;
        user.time_format = rawUser.time_format as string | null;
        user.number_format = rawUser.number_format as string | null;

        user.picture = rawUser.picture as string;
        user.state = State.fromString(rawUser.state as string);

        return user;
    }
}
