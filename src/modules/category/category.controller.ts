import { type IRequestContext } from '@thanhhoajs/thanhhoa';

import type { CategoryService } from './category.service';
import { CategoryCreate } from './dto/category.create';
import { CategoryQuery } from './dto/category.query';
import { CategoryUpdate } from './dto/category.update';

export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  /**
   * @swagger
   * /api/category:
   *   get:
   *     tags:
   *       - category
   *     summary: Get categories with pagination
   *     parameters:
   *       - in: query
   *         name: search
   *         schema:
   *           type: string
   *         required: false
   *         description: The search query
   *       - in: query
   *         name: fromDate
   *         schema:
   *           type: string
   *         required: false
   *         description: The start date
   *       - in: query
   *         name: toDate
   *         schema:
   *           type: string
   *         required: false
   *         description: The end date
   *       - in: query
   *         name: sort
   *         schema:
   *           type: string
   *         required: false
   *         description: The sort field
   *       - in: query
   *         name: order
   *         schema:
   *           type: string
   *         required: false
   *         description: The sort order
   *       - in: query
   *         name: page
   *         schema:
   *           type: number
   *         required: false
   *         description: The page number
   *       - in: query
   *         name: limit
   *         schema:
   *           type: number
   *         required: false
   *         description: The number of items per page
   *     responses:
   *       200:
   *         description: Success
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   */
  async getCategoriesWithPagination(
    context: IRequestContext,
  ): Promise<Response> {
    try {
      const dto = new CategoryQuery(context.query);

      const result = await this.categoryService.getCategoriesWithPagination(
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
   * /api/category/{id}:
   *   get:
   *     tags:
   *       - category
   *     summary: Get category by id
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: number
   *         required: true
   *         description: The ID of the category to retrieve
   *     responses:
   *       200:
   *         description: Success
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   */
  async getCategoryById(context: IRequestContext): Promise<Response> {
    try {
      const id = context.params.id as unknown as number;
      const result = await this.categoryService.getCategory({ id });

      return new Response(JSON.stringify(result), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * @swagger
   * /api/category:
   *   post:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - category
   *     summary: Create new category
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               description:
   *                 type: string
   *     responses:
   *       200:
   *         description: Success
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   */
  async createCategory(context: IRequestContext): Promise<Response> {
    try {
      const { name, description } = await context.request.json();
      const dto = new CategoryCreate({ name, description });

      const result = await this.categoryService.createCategory(dto);

      return new Response(JSON.stringify(result), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * @swagger
   * /api/category/{id}:
   *   patch:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - category
   *     summary: Update category
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: number
   *         required: true
   *         description: The ID of the category to update
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               description:
   *                 type: string
   *     responses:
   *       200:
   *         description: Success
   *         content:
   *           application/json:
   *             schema:
   *               type: boolean
   */
  async updateCategory(context: IRequestContext): Promise<Response> {
    try {
      const id = context.params.id as unknown as number;
      const { name, description } = await context.request.json();
      const dto = new CategoryUpdate({ name, description });

      const result = await this.categoryService.updateCategory(id, dto);

      return new Response(JSON.stringify(result), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * @swagger
   * /api/category/{id}:
   *   delete:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - category
   *     summary: Delete category
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: number
   *         required: true
   *         description: The ID of the category to delete
   *     responses:
   *       200:
   *         description: Success
   *         content:
   *           application/json:
   *             schema:
   *               type: boolean
   */
  async deleteCategory(context: IRequestContext): Promise<Response> {
    try {
      const id = context.params.id as unknown as number;
      const result = await this.categoryService.deleteCategory(id);

      return new Response(JSON.stringify(result), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      throw error;
    }
  }
}
