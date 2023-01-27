import {User} from '../User';
import {ObjectWrapper} from './ObjectWrapper';

describe('Test Object wrapping', () => {
    test('Test get properties that exist', () => {

        const user: User = new User();
        user.name = 'The username';
        const userX: User = ObjectWrapper.wrap(user, true);
        expect(userX.name).toStrictEqual(user.name);

        const raw: any = {
            'some_property': 'some_value'
        }
        const rawX: any = ObjectWrapper.wrap(raw);
        expect(rawX.some_property).toStrictEqual('some_value');
    });

    test('Test get properties that do not exist', () => {

        const raw: any = {
            'some_property': 'some_value'
        }
        const rawX: any = ObjectWrapper.wrap(raw, true);

        const t = () => {
            rawX.another_property
        };

        expect(t).toThrow(Error);

    });
})

