import EthClient from './eth-client';
import EthHTTPSClient from './eth-https-client';
import EthWSClient from './eth-ws-client';

/**
 * This helper function takes a node URL and returns the appropriate client, whether it's a websocket or https client
 * Resolves when the client is ready to use
 * @param nodeUrl the url of the node, http/https/ws/wss format
 */
export default async function getClient(nodeUrl: string): Promise<EthClient> {
  const lower = nodeUrl.toLowerCase();
  if (
    lower.indexOf('https:/') === 0 ||
    lower.indexOf('http:/') === 0
  ) {
    return new EthHTTPSClient({ endpointUrl: nodeUrl });
  } else if (
    lower.indexOf('wss:/') === 0 ||
    lower.indexOf('ws:/') === 0
  ) {
    return EthWSClient.Connect(nodeUrl);
  } else {
    throw new Error(`unknown url protocol in url "${nodeUrl}"`);
  }
}
