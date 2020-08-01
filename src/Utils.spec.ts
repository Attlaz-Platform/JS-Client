import {TriggerType} from './Model/Trigger/TriggerType';

test('Test enum parsing', () => {



    expect(TriggerType.fromString('webhook')).toBe(TriggerType.Webhook);

});
