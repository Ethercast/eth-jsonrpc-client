import {
  BlockWithFullTransactions,
  BlockWithTransactionHashes,
  Log,
  TransactionReceipt
} from '@ethercast/model';
import BigNumber from 'bignumber.js';
import fetch from 'cross-fetch';
import EthClient, {
  BlockParameter,
  LogFilter,
  SendTransactionParameters
} from './eth-client';
import { Method } from './json-rpc-methods';
import { buildRequest, MethodParameter } from './util';

/**
 * This client interacts with the JSON RPC via HTTP/HTTPS
 */
export default class EthHTTPClient implements EthClient {
  private readonly endpointUrl: string;
  private nextRequestId: number = 1;

  constructor({ endpointUrl }: { endpointUrl: string }) {
    this.endpointUrl = endpointUrl;
  }

  public eth_getBlockByHash(
    hash: string,
    includeFullTransactions: false
  ): Promise<BlockWithTransactionHashes>;

  public eth_getBlockByHash(
    hash: string,
    includeFullTransactions: true
  ): Promise<BlockWithFullTransactions>;

  public eth_getBlockByHash(
    hash: string,
    includeFullTransactions: boolean
  ): any {
    return this.cmd<BlockWithFullTransactions | BlockWithTransactionHashes>(
      Method.eth_getBlockByHash,
      hash,
      includeFullTransactions
    ).then(block => {
      if (block === null) {
        throw new Error(`block by hash does not exist: ${hash}`);
      }

      return block;
    });
  }

  public eth_getBlockByNumber(
    blockNumber: BlockParameter,
    includeFullTransactions: false
  ): Promise<BlockWithTransactionHashes>;

  public eth_getBlockByNumber(
    blockNumber: BlockParameter,
    includeFullTransactions: true
  ): Promise<BlockWithFullTransactions>;

  public eth_getBlockByNumber(
    blockNumber: BlockParameter,
    includeFullTransactions: boolean
  ): any {
    return this.cmd<BlockWithFullTransactions | BlockWithTransactionHashes>(
      Method.eth_getBlockByNumber,
      blockNumber,
      includeFullTransactions
    ).then(block => {
      if (block === null) {
        throw new Error(`block by number does not exist: ${blockNumber}`);
      }

      return block;
    });
  }

  public net_version(): Promise<number> {
    return this.cmd<string>(Method.net_version).then(s => parseInt(s, 10));
  }

  public web3_clientVersion = () => this.cmd<string>(Method.web3_clientVersion);

  public eth_blockNumber = () =>
    this.cmd<string>(Method.eth_blockNumber).then(s => new BigNumber(s));

  public eth_getLogs = (filter: LogFilter) =>
    this.cmd<Log[]>(Method.eth_getLogs, filter);

  public eth_getTransactionReceipt(hash: string): Promise<TransactionReceipt> {
    return this.cmd<TransactionReceipt>(
      Method.eth_getTransactionReceipt,
      hash
    ).then(receipt => {
      if (receipt === null) {
        throw new Error('invalid transaction hash');
      }

      return receipt;
    });
  }

  public async eth_getTransactionReceipts(
    hashes: string[]
  ): Promise<TransactionReceipt[]> {
    if (hashes.length === 0) {
      return [];
    }

    const results = await this.rpc<any>(
      hashes.map(hash =>
        buildRequest(this.nextRequestId++, Method.eth_getTransactionReceipt, [
          hash
        ])
      )
    );

    return results.map(({ result }: { result: any }) => {
      if (typeof result === 'undefined') {
        throw new Error('invalid response: ' + JSON.stringify(result));
      }

      if (result === null) {
        throw new Error('invalid transaction hash');
      }

      return result as TransactionReceipt;
    });
  }

  public eth_sendTransaction(
    params: SendTransactionParameters
  ): Promise<string> {
    return this.cmd<string>(Method.eth_sendTransaction, params);
  }

  public async cmd<TResponse>(
    method: Method,
    ...params: MethodParameter[]
  ): Promise<TResponse> {
    const request = buildRequest(this.nextRequestId++, method, params);

    const json = await this.rpc<any>(request);

    if (typeof json.error !== 'undefined') {
      throw new Error(
        `json rpc threw error code ${json.error.code}: ${json.error.message}`
      );
    }

    if (typeof json.result === 'undefined') {
      throw new Error(
        `failed to fetch: no 'result' key found in the body: ${JSON.stringify(
          json
        )}`
      );
    }

    return json.result;
  }

  private async rpc<TResponse>(body: any): Promise<TResponse> {
    const response = await fetch(this.endpointUrl, {
      body: JSON.stringify(body),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST'
    });

    let bodyText: string;

    try {
      bodyText = await response.text();
    } catch (err) {
      throw new Error(
        `failed to extract body text from response: ${err.message}`
      );
    }

    if (response.status !== 200) {
      throw new Error(
        `failed to fetch: expected http 200 status but got ${
          response.status
        } with text "${bodyText}"`
      );
    }

    let json: any;
    try {
      json = JSON.parse(bodyText);
    } catch (err) {
      throw new Error(
        `body text "${bodyText}" was not valid json: ${err.message}`
      );
    }

    return json;
  }
}
