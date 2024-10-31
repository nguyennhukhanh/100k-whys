import { type IRequestContext } from '@thanhhoajs/thanhhoa';

import { PostCreate } from './dto/post.create';
import { PostQuery } from './dto/post.query';
import type { PostService } from './post.service';

export class PostController {
  constructor(private postService: PostService) {}

  /**
   * @swagger
   * /api/post:
   *   get:
   *     tags:
   *       - post
   *     summary: Get items with pagination
   *     parameters:
   *       - in: query
   *         name: authorId
   *         schema:
   *           type: number
   *         required: false
   *       - in: query
   *         name: search
   *         schema:
   *           type: string
   *         required: false
   *       - in: query
   *         name: fromDate
   *         schema:
   *           type: string
   *         format: date
   *         required: false
   *       - in: query
   *         name: toDate
   *         schema:
   *           type: string
   *         format: date
   *         required: false
   *       - in: query
   *         name: sort
   *         schema:
   *           type: string
   *         required: false
   *       - in: query
   *         name: page
   *         schema:
   *           type: number
   *         required: false
   *       - in: query
   *         name: limit
   *         schema:
   *           type: number
   *         required: false
   *     responses:
   *       200:
   *         description: A list of items
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   */

  async getItemsWithPagination(context: IRequestContext): Promise<Response> {
    const dto = new PostQuery(context.query);

    const result = await this.postService.getItemsWithPagination(dto);
    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  /**
   * @swagger
   * /api/post:
   *   post:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - post
   *     summary: Create new post
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             properties:
   *               title:
   *                 type: string
   *               content:
   *                 type: string
   *               file:
   *                 type: string
   *                 format: binary
   *     responses:
   *       200:
   *         description: Success
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   */
  async createPost(context: IRequestContext): Promise<Response> {
    try {
      const input = await context.request.formData();

      const title = input.get('title') as string;
      const content = input.get('content') as string;
      const file = input.get('file') as File;

      const dto = new PostCreate({ title, content, file });

      const result = await this.postService.createPost(context.admin, dto);
      return new Response(JSON.stringify(result), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      throw error;
    }
  }
}
