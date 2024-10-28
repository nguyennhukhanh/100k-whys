import { HttpException } from '@thanhhoajs/thanhhoa';
import { eq } from 'drizzle-orm';
import { db } from 'src/database/db';
import { users } from 'src/database/schemas/users.schema';

export class UserService {
  async getUserByEmail(email: string) {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    return result[0];
  }

  async createUser(dto: { email: string; fullName: string; password: string }) {
    try {
      const userExist = await this.getUserByEmail(dto.email);
      if (userExist) {
        throw new HttpException('Email already exist', 409);
      }

      const newUsers = await db.insert(users).values(dto).$returningId();
      return {
        id: newUsers[0].id,
        email: dto.email,
        fullName: dto.fullName,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    } catch (error) {
      throw error;
    }
  }
}
