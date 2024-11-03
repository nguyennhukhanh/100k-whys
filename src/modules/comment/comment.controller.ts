import type { IRequestContext } from '@thanhhoajs/thanhhoa';
import { CommonQuery } from 'src/shared/dto/common.query';

import type { CommentService } from './comment.service';
import { CommentCreate } from './dto/comment.create';

export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  /**
   * @swagger
   * /api/comment/p/{postId}:
   *   get:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - comment
   *     summary: Get comments by post id
   *     parameters:
   *       - in: path
   *         name: postId
   *         schema:
   *           type: string
   *         required: true
   *         description: The ID of the post
   *       - in: query
   *         name: page
   *         schema:
   *           type: number
   *         default: 1
   *         description: The page number
   *       - in: query
   *         name: limit
   *         schema:
   *           type: number
   *         default: 10
   *         description: The number of items per page
   *     responses:
   *       200:
   *         description: Success
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 items:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       id:
   *                         type: number
   *                       postId:
   *                         type: string
   *                       responder:
   *                         type: object
   *                         properties:
   *                           id:
   *                             type: number
   *                           fullName:
   *                             type: string
   *                       parentId:
   *                         type: number
   *                       content:
   *                         type: string
   *                       createdAt:
   *                         type: string
   *                       updatedAt:
   *                         type: string
   *                 meta:
   *                   type: object
   *                   properties:
   *                     itemCount:
   *                       type: number
   *                     totalItems:
   *                       type: number
   *                     itemsPerPage:
   *                       type: number
   *                     totalPages:
   *                       type: number
   *                     currentPage:
   *                       type: number
   */
  async getCommentsByPostId(context: IRequestContext): Promise<Response> {
    try {
      const postId = context.params.postId;
      const { page, limit } = context.query;
      const query = new CommonQuery({
        page: parseInt(page),
        limit: parseInt(limit),
      });

      const result = await this.commentService.getCommentsByPostId(
        postId,
        query,
      );

      return new Response(JSON.stringify(result), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * @swagger
   * /api/comment/c/{commentId}:
   *   get:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - comment
   *     summary: Get comments by parent comment id
   *     parameters:
   *       - in: path
   *         name: commentId
   *         schema:
   *           type: number
   *         required: true
   *         description: The ID of the parent comment
   *       - in: query
   *         name: page
   *         schema:
   *           type: number
   *         default: 1
   *         description: The page number
   *       - in: query
   *         name: limit
   *         schema:
   *           type: number
   *         default: 10
   *         description: The number of items per page
   *     responses:
   *       200:
   *         description: Success
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       id:
   *                         type: number
   *                       postId:
   *                         type: string
   *                       responder:
   *                         type: object
   *                         properties:
   *                           id:
   *                             type: number
   *                           fullName:
   *                             type: string
   *                       parentId:
   *                         type: number
   *                       content:
   *                         type: string
   *                       createdAt:
   *                         type: string
   *                       updatedAt:
   *                         type: string
   *                 meta:
   *                   type: object
   *                   properties:
   *                     itemCount:
   *                       type: number
   *                     totalItems:
   *                       type: number
   *                     itemsPerPage:
   *                       type: number
   *                     totalPages:
   *                       type: number
   *                     currentPage:
   *                       type: number
   */
  async getCommentByParentCommentId(
    context: IRequestContext,
  ): Promise<Response> {
    try {
      const commentId = context.params.commentId as unknown as number;
      const { page, limit } = context.query;
      const query = new CommonQuery({
        page: parseInt(page),
        limit: parseInt(limit),
      });

      const result = await this.commentService.getCommentByParentCommentId(
        commentId,
        query,
      );

      return new Response(JSON.stringify(result), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * @swagger
   * /api/comment/p/{postId}:
   *   post:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - comment
   *     summary: Create comment by post id
   *     parameters:
   *       - in: path
   *         name: postId
   *         schema:
   *           type: string
   *         required: true
   *         description: The ID of the post
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               content:
   *                 type: string
   *     responses:
   *       200:
   *         description: Success
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: number
   *                     content:
   *                       type: string
   *       404:
   *         description: Not found
   */
  async createCommentByPostId(context: IRequestContext): Promise<Response> {
    try {
      const user = context.user;
      const postId = context.params.postId;
      const { content } = await context.request.json();
      const dto = new CommentCreate(content);

      const result = await this.commentService.createCommentByPostId(
        user,
        postId,
        dto,
      );

      return new Response(JSON.stringify(result), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * @swagger
   * /api/comment/c/{commentId}:
   *   post:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - comment
   *     summary: Create comment by parent comment id
   *     parameters:
   *       - in: path
   *         name: commentId
   *         schema:
   *           type: number
   *         required: true
   *         description: The ID of the parent comment
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               content:
   *                 type: string
   *     responses:
   *       200:
   *         description: Success
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: number
   *                     content:
   *                       type: string
   *       404:
   *         description: Not found
   */
  async createCommentByParentCommentId(
    context: IRequestContext,
  ): Promise<Response> {
    try {
      const user = context.user;
      const commentId = context.params.commentId as unknown as number;
      const { content } = await context.request.json();
      const dto = new CommentCreate(content);

      const result = await this.commentService.createCommentByParentCommentId(
        user,
        commentId,
        dto,
      );

      return new Response(JSON.stringify(result), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * @swagger
   * /api/comment/{commentId}:
   *   put:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - comment
   *     summary: Update comment
   *     parameters:
   *       - in: path
   *         name: commentId
   *         schema:
   *           type: number
   *         required: true
   *         description: The ID of the comment
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               content:
   *                 type: string
   *     responses:
   *       200:
   *         description: Success
   *         content:
   *           application/json:
   *             schema:
   *               type: boolean
   *       404:
   *         description: Not found
   */
  async updateComment(context: IRequestContext): Promise<Response> {
    try {
      const user = context.user;
      const commentId = context.params.commentId as unknown as number;
      const { content } = await context.request.json();
      const dto = new CommentCreate(content);

      const result = await this.commentService.updateComment(
        user,
        commentId,
        dto,
      );

      return new Response(JSON.stringify(result), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * @swagger
   * /api/comment/{commentId}:
   *   delete:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - comment
   *     summary: Delete comment
   *     parameters:
   *       - in: path
   *         name: commentId
   *         schema:
   *           type: number
   *         required: true
   *         description: The ID of the comment
   *     responses:
   *       200:
   *         description: Success
   *         content:
   *           application/json:
   *             schema:
   *               type: boolean
   *       404:
   *         description: Not found
   */
  async deleteComment(context: IRequestContext): Promise<Response> {
    try {
      const user = context.user;
      const commentId = context.params.commentId as unknown as number;

      const result = await this.commentService.deleteComment(user, commentId);

      return new Response(JSON.stringify(result), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      throw error;
    }
  }
}
