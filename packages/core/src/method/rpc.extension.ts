export class RPCExtension {
  ['rpc.ping']() {
    return 'pong';
  }
}
