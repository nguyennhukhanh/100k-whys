import * as argon2 from 'argon2';

export class HashService {
  async hash(data: string): Promise<string> {
    return await argon2.hash(data);
  }

  async compare(data: string, hash: string): Promise<boolean> {
    return await argon2.verify(hash, data);
  }
}
