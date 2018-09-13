import test from 'ava';
import BigNumber from 'bignumber.js';
import toHex from './to-hex';

test('to-hex.ts#toHex', t => {
  t.deepEqual(toHex(1), '0x1');
  t.deepEqual(toHex('1'), '0x1');
  t.deepEqual(toHex('0x1'), '0x1');
  t.deepEqual(toHex('0xf1'), '0xf1');
  t.deepEqual(toHex('159050'), '0x26d4a');
  t.deepEqual(toHex(new BigNumber('159050')), '0x26d4a');
  t.deepEqual(toHex(new BigNumber('0x26d4a')), '0x26d4a');

  t.throws(() => {
    toHex('0xdmflkmpozlp');
  });
});
