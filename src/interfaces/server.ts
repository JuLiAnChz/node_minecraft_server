import net from 'net';
import { ClientState, NetworkHandler } from '../infrastructure/network-handler';
import { State, Packet } from '../domain/types';
import logger from '../infrastructure/utils/logger';
import { PacketHandlerService } from '../infrastructure/packet-handler-service';

export class MinecraftServer {
  private networkHandler: NetworkHandler;

  constructor(private port: number) {
    this.networkHandler = new NetworkHandler(this.handlePacket.bind(this));
  }

  start() {
    this.networkHandler.createServer(this.port);
    logger.info(`Minecraft server listening on port ${this.port}`);
  }

  private handlePacket(
    socket: net.Socket,
    state: State,
    packet: Packet,
    clients: Map<net.Socket, ClientState>
  ) {
    return PacketHandlerService.handle(socket, state, packet, clients);
  }
}
