import test from 'ava';
import BigNumber from 'bignumber.js';
import EthHTTPSClient from './eth-https-client';

import ganache from 'ganache-cli';

const TEST_MNEMONIC =
  'cave future movie dentist tumble stone ready coach sword agree oblige maximum hero hockey blouse';
const ADDRESSES = [
  '0x942240251c710241749C168169486FBe4868b49a',
  '0x0dAd7D945673554904F03F52699529BF3Ad3fEAD',
  '0x1369af574A4FBa4E4834dCa951607c0112ADBbC1'
];

test('eth-https-client.ts', async t => {
  const server = ganache.server({ mnemonic: TEST_MNEMONIC });
  server.listen(8081);

  const cli = new EthHTTPSClient({ endpointUrl: 'http://localhost:8081' });

  // block number is 0
  t.true(new BigNumber(0).isEqualTo(await cli.eth_blockNumber()));

  const hash = await cli.eth_sendTransaction({
    from: ADDRESSES[0],
    to: ADDRESSES[1],
    value: 1000
  });

  t.true(typeof hash === 'string');

  // block number is 1
  t.true(new BigNumber(1).isEqualTo(await cli.eth_blockNumber()));

  // get tx by hash
  const tx = await cli.eth_getTransactionReceipt(hash);

  t.log('tx receipt', tx);

  t.true(new BigNumber(1).isEqualTo(tx.blockNumber));
});
