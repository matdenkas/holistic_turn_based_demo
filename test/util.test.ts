import { Util } from '../src/util';

test('isIn() includes top left', () => expect(Util.isIn(0, 0, 0, 0, 4, 4)).toBe(true));
test('isIn() includes bottom right', () => expect(Util.isIn(3, 3, 0, 0, 4, 4)).toBe(true));
test('isIn() excludes outside bottom right', () => expect(Util.isIn(3, 3, 0, 0, 3, 3)).toBe(false));
test('isIn() excludes outside top left', () => expect(Util.isIn(0, 0, 1, 1, 3, 3)).toBe(false));