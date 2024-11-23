export enum State {
  Handshaking,
  Status,
  Login,
  Configuration,
  Play,
}

export interface Packet {
  id: number;
  data: Buffer;
}

export function readVarInt(
  buffer: Buffer,
  offset = 0
): { value: number; bytesRead: number } {
  let numRead = 0;
  let result = 0;
  let byte: number;

  do {
    byte = buffer[offset + numRead];
    result |= (byte & 0x7f) << (7 * numRead);
    numRead++;
    if (numRead > 5) {
      throw new Error('VarInt is too big');
    }
  } while ((byte & 0x80) !== 0);

  return { value: result, bytesRead: numRead };
}

export function writeVarInt(value: number): Buffer {
  const buffer = Buffer.alloc(5);
  let currentByte = 0;

  do {
    buffer[currentByte] = value & 0x7f;
    if (value > 0x7f) {
      buffer[currentByte] |= 0x80;
    }
    value >>>= 7;
    currentByte++;
  } while (value > 0);

  return buffer.subarray(0, currentByte);
}

export function readString(
  buffer: Buffer,
  offset = 0
): { value: string; bytesRead: number } {
  const length = readVarInt(buffer, offset);
  const string = buffer
    .subarray(
      offset + length.bytesRead,
      offset + length.bytesRead + length.value
    )
    .toString('utf8');
  return { value: string, bytesRead: length.bytesRead + length.value };
}

export function writeString(value: string): Buffer {
  const stringBuffer = Buffer.from(value, 'utf8');
  return Buffer.concat([writeVarInt(stringBuffer.length), stringBuffer]);
}

export function writePosition(x: number, y: number, z: number): Buffer {
  const buffer = Buffer.alloc(8);
  const value =
    ((BigInt(x) & 0x3ffffffn) << 38n) |
    ((BigInt(z) & 0x3ffffffn) << 12n) |
    (BigInt(y) & 0xfffn);
  buffer.writeBigInt64BE(value);
  return buffer;
}
