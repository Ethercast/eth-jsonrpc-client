import BigNumber from 'bignumber.js';
import { NumberLike } from './eth-client';

/**
 * @hidden
 */
const hexPattern = /^0x[a-fA-F0-9]*$/;
/**
 * @hidden
 */
const decimalPattern = /^[0-9]+$/;

/**
 * Takes a NumberLike argument and turns it into a string that represents that number in hexadecimal
 * @hidden
 * @param numberLike the numberlike to convert to hexadecimal string
 */
export default function toHex(numberLike: NumberLike): string {
  if (typeof numberLike === 'string' && hexPattern.test(numberLike)) {
    return numberLike.toLowerCase();
  } else if (typeof numberLike === 'number') {
    return `0x${numberLike.toString(16)}`;
  } else if (
    typeof numberLike === 'string' &&
    decimalPattern.test(numberLike)
  ) {
    return `0x${parseInt(numberLike, 10).toString(16)}`;
  } else if (numberLike instanceof BigNumber) {
    return `0x${numberLike.toString(16)}`;
  } else {
    throw new Error(`did not understand numberLike argument: ${numberLike}`);
  }
}
