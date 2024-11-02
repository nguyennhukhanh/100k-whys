import { HashService } from '../auth/hash.service';
import { JwtService } from '../auth/jwt.service';
import { PostService } from '../post/post.service';
import { SessionService } from '../session/session.service';
import { RedisService } from './redis.service';

// Singleton instances
const hashServiceInstance = new HashService();
const sessionServiceInstance = new SessionService();
const jwtServiceInstance = new JwtService(sessionServiceInstance);
const redisServiceInstance = new RedisService();
const postServiceInstance = new PostService(redisServiceInstance);

export const hashService = hashServiceInstance;
export const sessionService = sessionServiceInstance;
export const jwtService = jwtServiceInstance;
export const redisService = redisServiceInstance;
export const postService = postServiceInstance;
