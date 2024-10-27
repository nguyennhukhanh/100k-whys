import { HttpException } from '@thanhhoajs/thanhhoa';
import { eq, sql } from 'drizzle-orm';
import { db } from 'src/database/db';
import { userSessions } from 'src/database/schemas/user-sessions.schema';
import { users } from 'src/database/schemas/users.schema';
import { v4 as uuidv4 } from 'uuid';

export class SessionService {
  async createUserSession(options: { sessionId?: string; userId: number }) {
    const { sessionId, userId } = options;
    let userSessionExists: any[] = [];

    if (sessionId) {
      userSessionExists = await db
        .select()
        .from(userSessions)
        .where(eq(userSessions.id, sessionId))
        .limit(1);
    } else if (userId) {
      userSessionExists = await db
        .select()
        .from(userSessions)
        .where(eq(userSessions.userId, userId))
        .limit(1);
    }

    // If a session exist, delete it
    if (userSessionExists.length > 0) {
      await this.deleteUserSession({ userId: userSessionExists[0].userId });
    }

    // Create a new session
    const newSession = {
      id: uuidv4(),
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.insert(userSessions).values(newSession);
    return newSession;
  }

  async getUserSession(sessionId: string) {
    const sessionsExist = await db
      .select({
        id: users.id,
        email: users.email,
        fullName: users.fullName,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(userSessions)
      .where(
        sql`${userSessions.id} = ${sessionId} AND ${
          userSessions.expiresAt
        } > ${new Date()}`,
      )
      .innerJoin(users, eq(userSessions.userId, users.id))
      .limit(1);

    if (sessionsExist.length > 0) {
      return sessionsExist[0];
    }

    throw new HttpException('Session not found', 404);
  }

  async deleteUserSession(
    options: Partial<{ sessionId: string; userId: number }>,
  ): Promise<boolean> {
    const { sessionId, userId } = options;
    const whereClause = sessionId
      ? eq(userSessions.id, sessionId)
      : userId
      ? eq(userSessions.userId, userId)
      : null;

    if (!whereClause) {
      throw new HttpException(
        'Either id or userId must be provided for deletion.',
        500,
      );
    }

    const result = await db.delete(userSessions).where(whereClause);

    return result[0].affectedRows > 0;
  }
}
