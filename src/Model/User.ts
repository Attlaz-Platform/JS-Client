export class User {
    id: string;
    username: string;
    email: string;
    firstname: string;
    picture: string;
    type: number;

    public static parse(rawUser: any): User {
        let user: User = new User();
        user.id = rawUser.id;
        user.username = rawUser.username;
        user.email = rawUser.email;
        user.firstname = rawUser.firstname;
        user.picture = rawUser.picture;
        user.type = rawUser.type;

        return user;
    }
}