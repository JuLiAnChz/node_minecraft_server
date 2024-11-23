import net from 'net';
import { State, Packet, readVarInt } from '../domain/types';
import logger from './utils/logger';

export interface ClientState {
  state: State;
  username: string;
  buffer: Buffer;
  configurationFinished: boolean;
}

export class NetworkHandler {
  private clients: Map<net.Socket, ClientState>;

  constructor(
    private handlePacket: (
      socket: net.Socket,
      state: State,
      packet: Packet,
      clietns: Map<net.Socket, ClientState>
    ) => void
  ) {
    this.clients = new Map();
  }

  createServer(port: number) {
    return net
      .createServer((socket) => this.handleConnection(socket))
      .listen(port);
  }

  private handleConnection(socket: net.Socket) {
    logger.info('Client connected');

    this.clients.set(socket, {
      state: State.Handshaking,
      username: '',
      buffer: Buffer.alloc(0),
      configurationFinished: false,
    });

    socket.on('data', (data) => {
      const clientState = this.clients.get(socket)!;
      clientState.buffer = Buffer.concat([clientState.buffer, data]);

      while (clientState.buffer.length > 0) {
        try {
          const { packet, remainingBuffer } = this.parsePacket(
            clientState.buffer
          );
          this.handlePacket(socket, clientState.state, packet, this.clients);
          clientState.buffer = remainingBuffer;
        } catch (error) {
          if (error instanceof Error && error.message === 'Incomplete packet') {
            break;
          }
          logger.error('Error processing packet:', error);
          clientState.buffer = Buffer.alloc(0);
        }
      }
    });

    socket.on('end', () => {
      logger.info('Client disconnected');
    });
  }

  private parsePacket(buffer: Buffer): {
    packet: Packet;
    remainingBuffer: Buffer;
  } {
    const { value: length, bytesRead: lengthSize } = readVarInt(buffer);

    if (buffer.length < length + lengthSize) {
      throw new Error('Incomplete packet');
    }

    const packetData = buffer.subarray(lengthSize, length + lengthSize);
    const { value: id, bytesRead: idSize } = readVarInt(packetData);

    return {
      packet: {
        id,
        data: packetData.subarray(idSize),
      },
      remainingBuffer: buffer.subarray(length + lengthSize),
    };
  }
}
