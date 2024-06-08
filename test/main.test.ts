import { hello } from '../src/index';

test('Test that hello() works', () => expect(hello('kimmy')).toBe('Hello kimmy! '));