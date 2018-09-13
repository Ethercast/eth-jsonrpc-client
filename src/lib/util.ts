import BigNumber from 'bignumber.js';
import * as _ from 'underscore';
import { Method } from './eth-client';
import toHex from './to-hex';

export type MethodParameter = boolean | string | number | BigNumber | object;

/**
 * Takes a method parameter and serializes it to something that the JSON RPC accepts
 * @param param parameter that should be serialized
 */
export function serializeToMethodParameter(param: any): MethodParameter {
  switch (typeof param) {
    case 'object':
      if (param instanceof BigNumber) {
        return toHex(param);
      }

      if (Array.isArray(param)) {
        return _.map(param, serializeToMethodParameter);
      }

      return _.mapObject(param, serializeToMethodParameter);

    case 'string':
      return param;

    case 'number':
      return toHex(param);

    case 'boolean':
      return param;

    default:
      throw new Error('unhandled type');
  }
}

let nextId = 1;

export function buildRequest(method: Method, params: MethodParameter[]) {
  return {
    id: nextId++,
    jsonrpc: '2.0',
    method,
    params: serializeToMethodParameter(params)
  };
}
