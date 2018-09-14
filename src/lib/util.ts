import BigNumber from 'bignumber.js';
import { Method } from './json-rpc-methods';
import toHex from './to-hex';

export type MethodParameter =
  | boolean
  | string
  | number
  | BigNumber
  | MethodParameterObject
  | MethodParameterArray;

export interface MethodParameterObject {
  [key: string]: MethodParameter | undefined;
}

export interface MethodParameterArray extends Array<MethodParameter> {}

/**
 * Takes a method parameter and serializes it to something that the JSON RPC accepts
 * @hidden
 * @param param parameter that should be serialized
 */
export function serializeToMethodParameter(param: any): MethodParameter {
  switch (typeof param) {
    case 'object':
      if (param instanceof BigNumber) {
        return toHex(param);
      }

      if (Array.isArray(param)) {
        return param.map(serializeToMethodParameter);
      }

      const serializedObject: { [key: string]: MethodParameter } = {};

      for (const k in param) {
        if (param.hasOwnProperty(k)) {
          serializedObject[k] = serializeToMethodParameter(param[k]);
        }
      }

      return serializedObject;

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

/**
 * Build a request for sending to the JSON RPC
 * @param id of the request
 * @param method method for the request
 * @param params parameters to be serialized to the request
 * @hidden
 */
export function buildRequest(
  id: number,
  method: Method,
  params: MethodParameter[]
) {
  return {
    id,
    jsonrpc: '2.0',
    method,
    params: serializeToMethodParameter(params)
  };
}
