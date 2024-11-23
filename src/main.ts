import logger from './infrastructure/utils/logger';
import { MinecraftServer } from './interfaces/server';

const PORT = 25565;
const server = new MinecraftServer(PORT);
server.start();

logger.info('Starting Minecraft server...');
