import net from 'net';
import * as packetHandlers from '../application/packet-handlers';
import { Packet, State } from '../domain/types';
import { ClientState } from './network-handler';

export class PacketHandlerService {
  private static handlerMap: Record<
    State,
    (
      socket: net.Socket,
      packet: Packet,
      clients: Map<net.Socket, ClientState>
    ) => State
  > = {
    [State.Handshaking]: packetHandlers.handleHandshake,
    [State.Status]: packetHandlers.handleStatus,
    [State.Login]: packetHandlers.handleLogin,
    [State.Configuration]: packetHandlers.handleConfiguration,
    [State.Play]: packetHandlers.handlePlay,
  };

  static handle(
    socket: net.Socket,
    state: State,
    packet: Packet,
    clients: Map<net.Socket, ClientState>
  ): State {
    const handler = this.handlerMap[state];

    if (!handler) {
      throw new Error('Invalid state');
    }

    return handler(socket, packet, clients);
  }
}
