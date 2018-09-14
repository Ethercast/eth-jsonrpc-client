import EthClient from './eth-client';
import EthHTTPClient from './eth-http-client';
import EthWebSocketClient from './eth-web-socket-client';
import ValidatedEthClient from './validated-eth-client';

/**
 * This helper function takes a node URL and returns the appropriate client, whether it's a websocket or https client
 * Resolves when the client is ready to use
 * @param nodeUrl the url of the node, http/https/ws/wss format
 * @param validated pass true if the client should validate responses coming from the RPC
 */
export default async function getClient(
  nodeUrl: string,
  validated: boolean = false
): Promise<EthClient> {
  let client: EthClient;

  const lower = nodeUrl.toLowerCase();
  if (lower.indexOf('https:/') === 0 || lower.indexOf('http:/') === 0) {
    client = new EthHTTPClient({ endpointUrl: nodeUrl });
  } else if (lower.indexOf('wss:/') === 0 || lower.indexOf('ws:/') === 0) {
    client = await EthWebSocketClient.Connect(nodeUrl);
  } else {
    throw new Error(`unknown protocol in url "${nodeUrl}"`);
  }

  if (validated) {
    client = new ValidatedEthClient(client);
  }

  return client;
}
