import test from 'ava';
import BigNumber from 'bignumber.js';
import { Http2Server } from 'http2';
import fetch from 'node-fetch';
import * as _ from 'underscore';
import * as WebSocket from 'ws';

import ganache from 'ganache-cli';
import getClient from './get-client';

const TEST_MNEMONIC =
  'cave future movie dentist tumble stone ready coach sword agree oblige maximum hero hockey blouse';

const ADDRESSES = [
  '0x942240251c710241749C168169486FBe4868b49a',
  '0x0dAd7D945673554904F03F52699529BF3Ad3fEAD',
  '0x1369af574A4FBa4E4834dCa951607c0112ADBbC1'
];

let server: Http2Server;
let wss: WebSocket.Server;

test.beforeEach(async t => {
  server = ganache.server({ mnemonic: TEST_MNEMONIC });
  server.listen(8081);

  wss = new WebSocket.Server({ port: 8082 });

  wss.on('connection', sock => {
    t.log('connection opened');

    // connection occured
    sock.on('message', data => {
      fetch(`http://localhost:8081/rpc`, {
        body: data.toString(),
        method: 'POST'
      })
        .then(res => {
          return res.text();
        })
        .then(text => {
          sock.send(text);
        })
        .catch(err => {
          sock.close(400, `error: ${err.message}`);
        });
    });
  });
});

_.each([ 'http://localhost:8081', 'ws://localhost:8082' ], addr =>
  test.serial(`eth-client@${addr}`, async t => {
    const cli = await getClient(addr);

    // block number is 0
    t.true(new BigNumber(0).isEqualTo(await cli.eth_blockNumber()));

    const hash = await cli.eth_sendTransaction({
      from: ADDRESSES[ 0 ],
      to: ADDRESSES[ 1 ],
      value: 1000
    });

    t.true(typeof hash === 'string');

    // block number is 1
    t.true(new BigNumber(1).isEqualTo(await cli.eth_blockNumber()));

    // get tx by hash
    const txReceipt = await cli.eth_getTransactionReceipt(hash);

    t.log('tx receipt', txReceipt);

    t.true(new BigNumber(1).isEqualTo(txReceipt.blockNumber));

    const block = await cli.eth_getBlockByHash(txReceipt.blockHash, true);

    t.true(new BigNumber(1).isEqualTo(block.number));
    t.deepEqual(txReceipt.blockHash, block.hash);
    t.deepEqual(block.transactions.length, 1);

    const logs = await cli.eth_getLogs({ fromBlock: 1, toBlock: 1 });
    t.deepEqual(logs, []);
  })
);

test.afterEach(async () => {
  wss.close();
  server.close();
});
