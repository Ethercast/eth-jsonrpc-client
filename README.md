# eth-jsonrpc-client
[![Build Status](https://travis-ci.org/Ethercast/eth-jsonrpc-client.svg?branch=master)](https://travis-ci.org/Ethercast/eth-jsonrpc-client)
[![codecov](https://codecov.io/gh/Ethercast/eth-jsonrpc-client/branch/master/graph/badge.svg)](https://codecov.io/gh/Ethercast/eth-jsonrpc-client)
[![NPM version][npm-svg]][npm]

   [npm]: https://www.npmjs.com/package/@ethercast/eth-jsonrpc-client
   [npm-svg]: https://img.shields.io/npm/v/@ethercast/eth-jsonrpc-client.svg?style=flat

Lightweight HTTP and WebSocket JSON RPC client for Ethereum, compatible with both geth and parity, made for polling blocks for the Ethercast project. 
Great for when Web3 is too heavy, and the only functionality required is to query the JSON RPC.

## Installation
`npm install --save @ethercast/eth-jsonrpc-client`

## Usage
To construct a client, call [`getClient(nodeUrl: string, validated: boolean)`](https://ethercast.github.io/eth-jsonrpc-client/globals.html#getclient) 
which will construct the appropriate client based on the URL (HTTP client or WebSocket client) 

Once you have a client, use one of the supported methods on the interface or call an unsupported method using `.cmd`, e.g.:

```typescript
import { getClient } from '@ethercast/eth-jsonrpc-client';

async function printBlockNumber(): Promise<void> {
  const validatedClient = getClient('http://infura.node.io/my-api-key', true);
  const blockNumber = await validatedClient.eth_blockNumber();
  console.log(`blockNumber is ${blockNumber}`);
}
``` 

## API Docs
https://ethercast.github.io/eth-jsonrpc-client/
