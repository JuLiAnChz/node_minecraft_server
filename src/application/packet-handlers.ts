import net from 'net';
import { Packet, State, readVarInt, readString } from '../domain/types';
import * as packets from './packets';
import logger from '../infrastructure/utils/logger';
import { ClientState } from '../infrastructure/network-handler';

export function handleHandshake(
  socket: net.Socket,
  packet: Packet,
  clients: Map<net.Socket, ClientState>
): State {
  if (packet.id === 0x00) {
    const protocolVersion = readVarInt(packet.data);
    const nextState = packet.data[packet.data.length - 1];
    logger.info(
      'Handshake received. Protocol version: ' +
        protocolVersion.value +
        ' Next state:' +
        nextState
    );
    const clientState = clients.get(socket)!;
    clientState.state = nextState;
    return nextState;
  }

  return State.Handshaking;
}

export function handleStatus(
  socket: net.Socket,
  packet: Packet,
  clients: Map<net.Socket, ClientState>
): State {
  if (packet.id === 0x00) {
    logger.info('Status request received');
    socket.write(packets.createStatusResponse());
  } else if (packet.id === 0x01) {
    logger.info('Ping request received');
    socket.write(packets.createPingResponse(packet.data));
  }

  return State.Status;
}

export function handleLogin(
  socket: net.Socket,
  packet: Packet,
  clients: Map<net.Socket, ClientState>
): State {
  if (packet.id === 0x00) {
    const clientState = clients.get(socket)!;
    const usernameData = readString(packet.data);
    const username = usernameData.value;
    logger.info('Login request received from: ' + username);
    socket.write(packets.createLoginSuccess(username));
    clientState.state = State.Configuration;
    return State.Configuration;
  }

  return State.Login;
}

export function handleConfiguration(
  socket: net.Socket,
  packet: Packet,
  clients: Map<net.Socket, ClientState>
): State {
  logger.info('Configuration packet received: ' + packet.id);
  const clientState = clients.get(socket)!;

  if (packet.id === 0x00) {
    // Cookie Request
    logger.info('Cookie request received');
    // Handle cookie request if needed
  } else if (packet.id === 0x01) {
    // Plugin Message
    const channel = readString(packet.data);
    logger.info('Plugin message received for channel: ' + channel.value);
  } else if (packet.id === 0x02) {
    // Client Information
    logger.info('Client information received');
    if (!clientState.configurationFinished) {
      logger.info('Sending finish configuration packet');
      socket.write(packets.createFinishConfiguration());
      clientState.configurationFinished = true;
    }
  } else if (packet.id === 0x00) {
    // Acknowledge Finish Configuration
    logger.info('Client acknowledged configuration finish');
    clientState.state = State.Play;
    sendPlayPackets(socket);
    return State.Play;
  }
  return State.Configuration;
}

export function handlePlay(
  socket: net.Socket,
  packet: Packet,
  clients: Map<net.Socket, ClientState>
): State {
  logger.info('Received play packet: ' + packet.id);
  // Handle play packets here
  return State.Play;
}

function sendConfigurationPackets(socket: net.Socket) {
  const brandData = Buffer.from('vanilla');
  socket.write(packets.createPluginMessage('minecraft:brand', brandData));
}

function sendPlayPackets(socket: net.Socket) {
  const entityId = Math.floor(Math.random() * 1000000);
  logger.info('Sending Login (play) packet');
  socket.write(packets.createLoginPlay(entityId));
  logger.info('Sending Player Abilities packet');
  socket.write(packets.createPlayerAbilities());
  logger.info('Sending Player Position packet');
  socket.write(packets.createPlayerPosition());
  // Send chunk data here (not implemented in this example)
  logger.info(`Play packets sent`);
}
