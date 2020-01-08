export class User {
    id: string;
    username: string;
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    language: string;
    time_zone: string;
    date_format: string;
    time_format: string;
    picture: string;

    type: number;

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
        user.type = rawUser.type;

        return user;
    }
}
