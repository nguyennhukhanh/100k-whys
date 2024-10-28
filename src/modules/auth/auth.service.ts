import { HttpException, type IRequestContext } from '@thanhhoajs/thanhhoa';

import type { SessionService } from '../session/session.service';
import type { UserService } from '../user/user.service';
import type { CreateUserDto } from './dto/user.create';
import type { HashService } from './hash.service';
import type { JwtService } from './jwt.service';

export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly hashService: HashService,
    private readonly jwtService: JwtService,
    private readonly sessionService: SessionService,
  ) {}

  async register({ fullName, email, password }: CreateUserDto) {
    try {
      const hashedPassword = await this.hashService.hash(password);
      const user = await this.userService.createUser({
        fullName,
        email,
        password: hashedPassword,
      });

      const sessionExist = await this.sessionService.createUserSession({
        userId: user.id,
      });

      const tokens = await this.jwtService.signUserTokens({
        session: sessionExist.id,
      });

      return {
        user,
        tokens,
      };
    } catch (error) {
      throw error;
    }
  }

  async login(email: string, password: string) {
    const userExist = await this.userService.getUserByEmail(email);

    if (!userExist) {
      throw new HttpException('User not found', 404);
    }

    const passwordMatch = await this.hashService.compare(
      password,
      userExist.password as string,
    );
    if (!passwordMatch) {
      throw new HttpException('Invalid password', 401);
    }

    const sessionExist = await this.sessionService.createUserSession({
      userId: userExist.id,
    });

    const tokens = await this.jwtService.signUserTokens({
      session: sessionExist.id,
    });

    return {
      user: {
        ...userExist,
        password: undefined,
      },
      tokens,
    };
  }

  async logout(context: IRequestContext): Promise<boolean> {
    try {
      const user = context.user;
      return await this.sessionService.deleteUserSession({
        userId: user.id,
      });
    } catch (error) {
      throw error;
    }
  }

  async refreshToken(context: IRequestContext) {
    try {
      const user = context.user;
      const sessionExist = await this.sessionService.createUserSession({
        userId: user.id,
      });

      const tokens = await this.jwtService.signUserTokens({
        session: sessionExist.id,
      });

      return {
        user,
        tokens,
      };
    } catch (error) {
      throw error;
    }
  }
}
