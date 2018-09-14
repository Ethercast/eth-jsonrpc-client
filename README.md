# eth-jsonrpc-client
[![Build Status](https://travis-ci.org/Ethercast/eth-jsonrpc-client.svg?branch=master)](https://travis-ci.org/Ethercast/eth-jsonrpc-client)
[![codecov](https://codecov.io/gh/Ethercast/eth-jsonrpc-client/branch/master/graph/badge.svg)](https://codecov.io/gh/Ethercast/eth-jsonrpc-client)

Lightweight HTTP and WebSocket JSON RPC client for Ethereum, compatible with both geth and parity, made for polling blocks from Ethercast. 
Great for when Web3 is too heavy.

## Installation
`npm install --save @ethercast/eth-jsonrpc-client`

## Usage
There are three main classes exported from this module. `EthHTTPClient`, `EthWebSocketClient`, and `ValidatedEthClient`.

To construct a client, call [`getClient(nodeUrl: string)`](https://ethercast.github.io/eth-jsonrpc-client/globals.html#getclient) 
which will construct the appropriate client based on the URL (HTTP or WebSocket) 

Once you have a client, use one of the supported methods on the interface or call an unsupported method using `.cmd`, e.g.:

```typescript
import { EthClient } from '@ethercast/eth-jsonrpc-client';
import BigNumber from 'bignumber.js';

async function getBlockNumber(): BigNumber {
    const client: EthClient = getClient('http://infura.node.io/my-api-key');
    const blockNumber = await client.eth_blockNumber();
    console.log(`blockNumber is ${blockNumber}`);
}
``` 

## API Docs
https://ethercast.github.io/eth-jsonrpc-client/
