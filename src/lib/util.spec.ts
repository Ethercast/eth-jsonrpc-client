import test from 'ava';
import BigNumber from 'bignumber.js';
import { Method } from './json-rpc-methods';
import { buildRequest, serializeToMethodParameter } from './util';

test('util.ts#serializeToMethodParameter', t => {
  [
    ['hello world', 'hello world'],
    ['0x0', '0x0'],
    [1234, '0x4d2'],
    [new BigNumber(123), '0x7b'],
    [new BigNumber(1234), '0x4d2'],
    [['hello world', true, 1234], ['hello world', true, '0x4d2']],
    [
      { abc: 1234, def: false, ghi: true, bn: new BigNumber(123) },
      {
        abc: '0x4d2',
        bn: '0x7b',
        def: false,
        ghi: true
      }
    ]
  ].forEach(([v, e]) => {
    t.deepEqual(serializeToMethodParameter(v), e);
  });

  t.throws(() => {
    serializeToMethodParameter(void 0);
  });
});

test('util.ts#buildRequest', t => {
  t.deepEqual(buildRequest(15, Method.eth_blockNumber, []), {
    id: 15,
    jsonrpc: '2.0',
    method: Method.eth_blockNumber,
    params: []
  });
});
