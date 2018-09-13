import {
  BlockWithFullTransactions,
  BlockWithTransactionHashes,
  Log,
  TransactionReceipt
} from '@ethercast/model';
import BigNumber from 'bignumber.js';
import { MethodParameter } from './util';

export enum Method {
  web3_clientVersion = 'web3_clientVersion',
  eth_getBlockByHash = 'eth_getBlockByHash',
  eth_blockNumber = 'eth_blockNumber',
  eth_getBlockByNumber = 'eth_getBlockByNumber',
  eth_getLogs = 'eth_getLogs',
  net_version = 'net_version',
  eth_getTransactionReceipt = 'eth_getTransactionReceipt',
  eth_sendTransaction = 'eth_sendTransaction'
}

export type NumberLike = string | number | BigNumber;

export type BlockParameter = NumberLike | 'earliest' | 'latest' | 'pending';

export interface LogFilter {
  topics?: Array<string | string[]>;
  fromBlock: BlockParameter;
  toBlock: BlockParameter;
  address?: string;
}

export interface SendTransactionParameters {
  from: string;
  to?: string;
  gas?: NumberLike;
  gasPrice?: NumberLike;
  value?: NumberLike;
  data?: string;
  nonce?: NumberLike;
}

export default interface EthClient {
  net_version(): Promise<number>;

  web3_clientVersion(): Promise<string>;

  eth_getBlockByHash(
    hash: string,
    includeFullTransactions: false
  ): Promise<BlockWithTransactionHashes>;

  eth_getBlockByHash(
    hash: string,
    includeFullTransactions: true
  ): Promise<BlockWithFullTransactions>;

  eth_getBlockByNumber(
    blockNumber: BlockParameter,
    includeFullTransactions: false
  ): Promise<BlockWithTransactionHashes>;

  eth_getBlockByNumber(
    blockNumber: BlockParameter,
    includeFullTransactions: true
  ): Promise<BlockWithFullTransactions>;

  eth_blockNumber(): Promise<BigNumber>;

  eth_getLogs(filter: LogFilter): Promise<Log[]>;

  eth_getTransactionReceipt(hash: string): Promise<TransactionReceipt>;

  eth_getTransactionReceipts(hashes: string[]): Promise<TransactionReceipt[]>;

  eth_sendTransaction(params: SendTransactionParameters): Promise<string>;

  // The generic call to make any command with some parameters
  cmd<TResponse>(
    method: Method,
    ...params: MethodParameter[]
  ): Promise<TResponse>;
}
