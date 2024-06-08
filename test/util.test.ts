import { hello } from '../src/util';

test('Test that hello() works', () => expect(hello('kimmy')).toBe('Hello kimmy! '));