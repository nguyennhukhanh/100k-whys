import { type IRequestContext } from '@thanhhoajs/thanhhoa';
import { parseJson } from 'src/utils/json-parse';

import { PostCreate } from './dto/post.create';
import { PostQuery } from './dto/post.query';
import { PostUpdate } from './dto/post.update';
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
  async getPostsWithPagination(context: IRequestContext): Promise<Response> {
    const dto = new PostQuery(context.query);

    const result = await this.postService.getPostsWithPagination(dto);
    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  /**
   * @swagger
   * /api/post/{id}:
   *   get:
   *     tags:
   *       - post
   *     summary: Get post by id
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: The ID of the post to retrieve
   *     responses:
   *       200:
   *         description: Success
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   */
  async getPostById(context: IRequestContext): Promise<Response> {
    const id = context.params.id as string;
    const result = await this.postService.getPostById(id);

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
   *               categoryIds:
   *                 type: string
   *               publishedAt:
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
      const categoryIds = parseJson({
        name: 'categoryIds',
        value: input.get('categoryIds') as string,
      }) as number[];
      const publishedAt = input.get('publishedAt') as unknown as Date;
      const file = input.get('file') as File;

      const dto = new PostCreate({
        title,
        content,
        categoryIds,
        publishedAt,
        file,
      });

      const result = await this.postService.createPost(context.admin, dto);
      return new Response(JSON.stringify(result), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * @swagger
   * /api/post/{id}:
   *   patch:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - post
   *     summary: Update post
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: The ID of the post to update
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
   *               categoryIds:
   *                 type: string
   *               publishedAt:
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
   *               type: boolean
   */
  async updatePost(context: IRequestContext): Promise<Response> {
    try {
      const id = context.params.id as string;
      const input = await context.request.formData();

      const title = input.get('title') as string;
      const content = input.get('content') as string;
      const categoryIds = (input.get('categoryIds') as string)
        ? (parseJson({
            name: 'categoryIds',
            value: input.get('categoryIds') as string,
          }) as number[])
        : undefined;
      const publishedAt = input.get('publishedAt') as unknown as Date;
      const file = input.get('file') as File;

      const dto = new PostUpdate({
        title,
        content,
        categoryIds,
        publishedAt,
        file,
      });

      const result = await this.postService.updatePost(context.admin, id, dto);

      return new Response(JSON.stringify(result), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * @swagger
   * /api/post/{id}:
   *   delete:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - post
   *     summary: Soft delete post
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: The ID of the post to delete
   *     responses:
   *       200:
   *         description: Success
   *         content:
   *           application/json:
   *             schema:
   *               type: boolean
   */
  async softDeletePost(context: IRequestContext): Promise<Response> {
    try {
      const id = context.params.id as string;
      const result = await this.postService.softDeletePost(context.admin, id);

      return new Response(JSON.stringify(result), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      throw error;
    }
  }
}
