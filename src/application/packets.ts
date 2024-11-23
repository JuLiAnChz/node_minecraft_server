import { writeVarInt, writeString, writePosition } from '../domain/types';
import crypto from 'crypto';

export function createStatusResponse(): Buffer {
  const response = {
    version: {
      name: '1.21.3',
      protocol: 768,
    },
    players: {
      max: 20,
      online: 0,
      sample: [],
    },
    description: {
      text: 'A Minecraft Server',
    },
  };

  const jsonResponse = JSON.stringify(response);
  const jsonLength = writeVarInt(jsonResponse.length);
  const packetId = writeVarInt(0x00);

  return Buffer.concat([
    writeVarInt(jsonLength.length + packetId.length + jsonResponse.length),
    packetId,
    jsonLength,
    Buffer.from(jsonResponse),
  ]);
}

export function createPingResponse(payload: Buffer): Buffer {
  const packetId = writeVarInt(0x01);
  return Buffer.concat([
    writeVarInt(payload.length + packetId.length),
    packetId,
    payload,
  ]);
}

export function createLoginSuccess(username: string): Buffer {
  const packetId = writeVarInt(0x02);
  const uuid = crypto.randomUUID();
  const uuidBuffer = Buffer.from(uuid.replace(/-/g, ''), 'hex');

  const packet = Buffer.concat([
    packetId,
    uuidBuffer,
    writeString(username),
    writeVarInt(0), // Number of properties (0 in this case)
  ]);

  return Buffer.concat([writeVarInt(packet.length), packet]);
}

export function createLoginPlay(entityId: number): Buffer {
  const packetId = writeVarInt(0x28);
  const gamemode = 1; // Creative mode
  const previousGamemode = 255; // No previous gamemode
  const dimensionCount = writeVarInt(1);
  const dimensionNames = writeString('minecraft:overworld');
  const dimensionType = writeString('minecraft:overworld');
  const dimensionName = writeString('minecraft:overworld');
  const hashedSeed = Buffer.alloc(8).fill(0);
  const maxPlayers = writeVarInt(20);
  const viewDistance = writeVarInt(10);
  const simulationDistance = writeVarInt(10);
  const reducedDebugInfo = false;
  const enableRespawnScreen = true;
  const isDebug = false;
  const isFlat = true;
  const deathLocation = null; // No death location
  const portalCooldown = writeVarInt(0);

  const packet = Buffer.concat([
    packetId,
    Buffer.from([entityId]),
    Buffer.from([gamemode]),
    Buffer.from([previousGamemode]),
    dimensionCount,
    dimensionNames,
    dimensionType,
    dimensionName,
    hashedSeed,
    maxPlayers,
    viewDistance,
    simulationDistance,
    Buffer.from([reducedDebugInfo ? 1 : 0]),
    Buffer.from([enableRespawnScreen ? 1 : 0]),
    Buffer.from([isDebug ? 1 : 0]),
    Buffer.from([isFlat ? 1 : 0]),
    Buffer.from([deathLocation === null ? 0 : 1]),
    portalCooldown,
  ]);

  return Buffer.concat([writeVarInt(packet.length), packet]);
}

export function createPlayerAbilities(): Buffer {
  const packetId = writeVarInt(0x32);
  const flags = 0x07; // Creative mode flags (0111 in binary)
  const flyingSpeed = Buffer.alloc(4);
  flyingSpeed.writeFloatBE(0.05);
  const fieldOfViewModifier = Buffer.alloc(4);
  fieldOfViewModifier.writeFloatBE(0.1);

  const packet = Buffer.concat([
    packetId,
    Buffer.from([flags]),
    flyingSpeed,
    fieldOfViewModifier,
  ]);

  return Buffer.concat([writeVarInt(packet.length), packet]);
}

export function createPlayerPosition(): Buffer {
  const packetId = writeVarInt(0x3c);
  const x = 0;
  const y = 64;
  const z = 0;
  const yaw = 0;
  const pitch = 0;
  const flags = 0;
  const teleportId = writeVarInt(0);

  const packet = Buffer.concat([
    packetId,
    writePosition(x, y, z),
    Buffer.from([yaw, pitch, flags]),
    teleportId,
  ]);

  return Buffer.concat([writeVarInt(packet.length), packet]);
}

export function createFinishConfiguration(): Buffer {
  const packetId = writeVarInt(0x03);
  return Buffer.concat([writeVarInt(1), packetId]);
}

export function createPluginMessage(channel: string, data: Buffer): Buffer {
  const packetId = writeVarInt(0x01);
  const packet = Buffer.concat([packetId, writeString(channel), data]);
  return Buffer.concat([writeVarInt(packet.length), packet]);
}

export function createDisconnect(reason: string): Buffer {
  const packetId = writeVarInt(0x02);
  const packet = Buffer.concat([
    packetId,
    writeString(JSON.stringify({ text: reason })),
  ]);
  return Buffer.concat([writeVarInt(packet.length), packet]);
}
