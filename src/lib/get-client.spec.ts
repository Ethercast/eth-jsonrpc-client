import test from 'ava';
import * as WebSocket from 'ws';
import EthHTTPClient from './eth-http-client';
import getClient from './get-client';
import ValidatedEthClient from './validated-eth-client';

test('get-client.ts', async t => {
  t.true(getClient('http://localhost:8500') instanceof Promise);
  t.true((await getClient('http://localhost:8500')) instanceof EthHTTPClient);
  t.true(
    (await getClient('http://localhost:8500', true)) instanceof
      ValidatedEthClient
  );

  await t.throwsAsync(getClient('htt://localhost:8500'));
  await t.throwsAsync(getClient('wsc://localhost:8500'));

  // this should fail with timeout
  await t.throwsAsync(getClient('ws://localhost:8080'));

  // start a ws server for ethwsclient so it succeeds to connect
  const server = new WebSocket.Server({ port: 8080 });

  server.addListener('connection', (_: any, req: any) => {
    t.log(`connection from: ${req.connection.remoteAddress}`);
  });

  await getClient('ws://localhost:8080');

  server.close();
});
