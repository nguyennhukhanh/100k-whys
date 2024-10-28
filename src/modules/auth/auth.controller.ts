import type { IRequestContext } from '@thanhhoajs/thanhhoa';

import type { AuthService } from './auth.service';
import { CreateUserDto } from './dto/user.create';
import { ValidateUserDto } from './dto/user.validate';

export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * @swagger
   * paths:
   *   /api/auth/register:
   *     post:
   *       tags:
   *         - auth
   *       summary: Register
   *       description: Register
   *       requestBody:
   *         required: true
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 email:
   *                   type: string
   *                   format: email
   *                   default: user@example.com
   *                 password:
   *                   type: string
   *                   default: 123456
   *                 fullName:
   *                   type: string
   *                   default: Khanh Nguyen
   *               required:
   *                 - email
   *                 - password
   *                 - fullName
   *       responses:
   *         200:
   *           description: Success
   *           content:
   *             application/json:
   *               schema:
   *                 type: object
   *                 properties:
   *                   user:
   *                     type: object
   *                     properties:
   *                       id:
   *                         type: number
   *                       email:
   *                         type: string
   *                       fullName:
   *                         type: string
   *                   tokens:
   *                        type: object
   *                        properties:
   *                          accessToken:
   *                            type: string
   *                          refreshToken:
   *                            type: string
   *                          expiresAt:
   *                            type: number
   *         409:
   *           description: Unauthorized
   *           content:
   *             application/json:
   *               schema:
   *                 type: object
   *                 properties:
   *                   meta:
   *                     type: object
   *                     properties:
   *                       status:
   *                         type: number
   *                         example: 409
   *                       message:
   *                         type: string
   *                         example: Email already exist
   */
  async register(context: IRequestContext): Promise<Response> {
    try {
      const { email, password, fullName } = await context.request.json();
      const dto = new CreateUserDto(email, fullName, password);

      const user = await this.authService.register(dto);

      return new Response(JSON.stringify(user), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * @swagger
   * paths:
   *   /api/auth/login:
   *     post:
   *       tags:
   *         - auth
   *       summary: Login
   *       description: Login
   *       requestBody:
   *         required: true
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 email:
   *                   type: string
   *                   format: email
   *                   default: user@example.com
   *                 password:
   *                   type: string
   *                   default: 123456
   *               required:
   *                 - email
   *                 - password
   *                 - fullName
   *       responses:
   *         200:
   *           description: Success
   *           content:
   *             application/json:
   *               schema:
   *                 type: object
   *                 properties:
   *                   user:
   *                     type: object
   *                     properties:
   *                       id:
   *                         type: number
   *                       email:
   *                         type: string
   *                       fullName:
   *                         type: string
   *                       createdAt:
   *                         type: string
   *                       updatedAt:
   *                         type: string
   *                   tokens:
   *                        type: object
   *                        properties:
   *                          accessToken:
   *                            type: string
   *                          refreshToken:
   *                            type: string
   *                          expiresAt:
   *                            type: number
   *         404:
   *           description: Not found
   *           content:
   *             application/json:
   *               schema:
   *                 type: object
   *                 properties:
   *                   meta:
   *                     type: object
   *                     properties:
   *                       status:
   *                         type: number
   *                         example: 404
   *                       message:
   *                         type: string
   *                         example: Not found
   */
  async login(context: IRequestContext): Promise<Response> {
    try {
      const { email, password } = await context.request.json();
      new ValidateUserDto(email, password);

      const user = await this.authService.login(email, password);

      return new Response(JSON.stringify(user), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * @swagger
   * paths:
   *   /api/auth/logout:
   *     get:
   *       security:
   *         - bearerAuth: []
   *       tags:
   *         - auth
   *       summary: Logout
   *       description: Logout
   *       responses:
   *         200:
   *           description: Success
   *           content:
   *             application/json:
   *               schema:
   *                 type: object
   *                 properties:
   *                   isLogout:
   *                     type: boolean
   *                     example: true
   *         401:
   *           description: Unauthorized
   *           content:
   *             application/json:
   *               schema:
   *                 type: object
   *                 properties:
   *                   meta:
   *                     type: object
   *                     properties:
   *                       status:
   *                         type: number
   *                         example: 401
   *                       message:
   *                         type: string
   *                         example: Unauthorized
   */
  async logout(context: IRequestContext): Promise<Response> {
    try {
      const isLogout = await this.authService.logout(context);
      return new Response(JSON.stringify({ isLogout }), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * @swagger
   * paths:
   *   /api/auth/refresh-token:
   *     get:
   *       security:
   *         - bearerAuth: []
   *       tags:
   *         - auth
   *       summary: Refresh token
   *       description: Refresh token
   *       responses:
   *         200:
   *           description: Success
   *           content:
   *             application/json:
   *               schema:
   *                 type: object
   *                 properties:
   *                   user:
   *                     type: object
   *                     properties:
   *                       id:
   *                         type: number
   *                       email:
   *                         type: string
   *                       fullName:
   *                         type: string
   *                       createdAt:
   *                         type: string
   *                       updatedAt:
   *                         type: string
   *                   tokens:
   *                       type: object
   *                       properties:
   *                         accessToken:
   *                           type: string
   *                         refreshToken:
   *                           type: string
   *                         expiresAt:
   *                           type: number
   *         404:
   *           description: Not found
   *           content:
   *             application/json:
   *               schema:
   *                 type: object
   *                 properties:
   *                   meta:
   *                     type: object
   *                     properties:
   *                       status:
   *                         type: number
   *                       message:
   *                         type: string
   *                         example: Not found
   */
  async refreshToken(context: IRequestContext): Promise<Response> {
    try {
      const user = await this.authService.refreshToken(context);
      return new Response(JSON.stringify(user), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      throw error;
    }
  }
}
