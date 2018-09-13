import {
  BlockWithFullTransactions,
  BlockWithTransactionHashes,
  Log,
  mustBeValidBlockWithFullTransactions,
  mustBeValidBlockWithTransactionHashes,
  mustBeValidLog,
  mustBeValidTransactionReceipt,
  TransactionReceipt
} from '@ethercast/model';
import BigNumber from 'bignumber.js';
import EthClient, { BlockParameter, LogFilter } from './eth-client';

export default class ValidatedEthClient implements EthClient {
  private client: EthClient;

  constructor(client: EthClient) {
    this.client = client;
  }

  public net_version(): Promise<number> {
    return this.client.net_version();
  }

  public web3_clientVersion(): Promise<string> {
    return this.client.web3_clientVersion();
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
    if (includeFullTransactions) {
      return this.client
        .eth_getBlockByHash(hash, true)
        .then(mustBeValidBlockWithFullTransactions);
    } else {
      return this.client
        .eth_getBlockByHash(hash, false)
        .then(mustBeValidBlockWithTransactionHashes);
    }
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
    if (includeFullTransactions) {
      return this.client
        .eth_getBlockByNumber(blockNumber, true)
        .then(mustBeValidBlockWithFullTransactions);
    } else {
      return this.client
        .eth_getBlockByNumber(blockNumber, false)
        .then(mustBeValidBlockWithTransactionHashes);
    }
  }

  public eth_blockNumber(): Promise<BigNumber> {
    return this.client.eth_blockNumber();
  }

  public eth_getLogs(filter: LogFilter): Promise<Log[]> {
    return this.client
      .eth_getLogs(filter)
      .then(logs => logs.map(mustBeValidLog));
  }

  public eth_getTransactionReceipt(hash: string): Promise<TransactionReceipt> {
    return this.client
      .eth_getTransactionReceipt(hash)
      .then(mustBeValidTransactionReceipt);
  }

  public eth_getTransactionReceipts(
    hashes: string[]
  ): Promise<TransactionReceipt[]> {
    return this.client
      .eth_getTransactionReceipts(hashes)
      .then(receipts => receipts.map(mustBeValidTransactionReceipt));
  }
}
