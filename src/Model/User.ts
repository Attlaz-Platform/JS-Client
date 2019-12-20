export class User {
    id: string;
    username: string;
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    language: string;
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
        user.picture = rawUser.picture;
        user.type = rawUser.type;

        return user;
    }
}
