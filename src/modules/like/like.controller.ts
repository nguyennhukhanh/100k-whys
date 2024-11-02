import type { IRequestContext } from '@thanhhoajs/thanhhoa';

import type { LikeService } from './like.service';

export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  /**
   * @swagger
   * /api/like/{postId}:
   *   get:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - like
   *     summary: Check if a user has liked a post
   *     parameters:
   *       - in: path
   *         name: postId
   *         schema:
   *           type: string
   *         required: true
   *         description: The ID of the post
   *     responses:
   *       200:
   *         description: Success
   *         content:
   *           application/json:
   *             schema:
   *               type: boolean
   */
  async isLikedPost(context: IRequestContext): Promise<Response> {
    try {
      const user = context.user;
      const { postId } = context.params;
      const result = await this.likeService.isLikedPost(user, postId);
      return new Response(JSON.stringify(result), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * @swagger
   * /api/like/{postId}:
   *   post:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - like
   *     summary: Like a post
   *     parameters:
   *       - in: path
   *         name: postId
   *         schema:
   *           type: string
   *         required: true
   *         description: The ID of the post
   *     responses:
   *       200:
   *         description: Success
   *         content:
   *           application/json:
   *             schema:
   *               type: boolean
   *       404:
   *         description: Post not found
   */
  async likePost(context: IRequestContext): Promise<Response> {
    try {
      const user = context.user;
      const { postId } = context.params;
      const result = await this.likeService.likePost(user, postId);
      return new Response(JSON.stringify(result), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * @swagger
   * /api/unlike/{postId}:
   *   post:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - like
   *     summary: Unlike a post
   *     parameters:
   *       - in: path
   *         name: postId
   *         schema:
   *           type: string
   *         required: true
   *         description: The ID of the post
   *     responses:
   *       200:
   *         description: Success
   *         content:
   *           application/json:
   *             schema:
   *               type: boolean
   *       404:
   *         description: Post not found
   */
  async unlikePost(context: IRequestContext): Promise<Response> {
    try {
      const user = context.user;
      const { postId } = context.params;
      const result = await this.likeService.unlikePost(user, postId);
      return new Response(JSON.stringify(result), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      throw error;
    }
  }
}
