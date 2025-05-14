import {ChannelType} from './Model/Messaging/Channel/ChannelType.js';
import {CodeDeployStatus} from './Model/Project/CodeDeployStatus.js';
import {State} from './Model/State.js';
import {LogLevel} from './Model/Log/LogLevel.js';
import {StorageType} from './Model/Storage/StorageType.js';
import {Utils} from './Utils.js';
import {FlowRunStatus} from './Model/Flow/FlowRunStatus.js';

describe('Test utils', () => {
    test('Test enum parsing', () => {
        expect(FlowRunStatus.fromString('complete')).toBe(FlowRunStatus.Complete);
        expect(ChannelType.fromString('slack')).toBe(ChannelType.Slack);
        expect(LogLevel.fromString('debug')).toBe(LogLevel.Debug);
        expect(CodeDeployStatus.fromString('complete')).toBe(CodeDeployStatus.Complete);
        expect(StorageType.fromString('cache')).toBe(StorageType.Cache);
        expect(State.fromString('active')).toBe(State.Active);
    });
    test('Test base64 encode/decode', () => {
        expect(Utils.base64encode('Lorem ipsum')).toBe('TG9yZW0gaXBzdW0=');
        expect(Utils.base64encode('55128450')).toBe('NTUxMjg0NTA=');
        expect(Utils.base64encode(55128450 as any)).toBe('NTUxMjg0NTA=');

        expect(Utils.base64decode('TG9yZW0gaXBzdW0=')).toBe('Lorem ipsum');
        expect(Utils.base64decode('NTUxMjg0NTA=')).toBe('55128450');
    });
    test('Test if iterable', () => {
        expect(Utils.isIterable(null)).toBe(false);
        expect(Utils.isIterable('')).toBe(false);
        expect(Utils.isIterable('Lorem')).toBe(false);
        expect(Utils.isIterable(false)).toBe(false);
        expect(Utils.isIterable(true)).toBe(false);
        expect(Utils.isIterable(undefined)).toBe(false);
        expect(Utils.isIterable(12)).toBe(false);

        expect(Utils.isIterable([])).toBe(true);
        expect(Utils.isIterable(['L', 'O', 'R', 'E', 'M'])).toBe(true);

        expect(Utils.isIterable({})).toBe(false);
        expect(Utils.isIterable({a: 'a', b: 'b'})).toBe(false);
    });
})
