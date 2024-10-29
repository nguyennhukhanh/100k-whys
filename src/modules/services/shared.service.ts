import { JwtService } from '../auth/jwt.service';
import { SessionService } from '../session/session.service';
import { RedisService } from './redis.service';

const sessionServiceInstance = new SessionService();
const jwtServiceInstance = new JwtService(sessionServiceInstance);
const redisServiceInstance = new RedisService();

export const sessionService = sessionServiceInstance;
export const jwtService = jwtServiceInstance;
export const redisService = redisServiceInstance;
