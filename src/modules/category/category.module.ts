import type { IRequestContext, ThanhHoa } from '@thanhhoajs/thanhhoa';
import { RoleEnum } from 'src/shared/enums';

import { GUARD } from '../services/guard.service';
import { redisService } from '../services/shared.service';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';

export class CategoryModule {
  constructor(app: ThanhHoa) {
    const categoryService = new CategoryService(redisService);
    const categoryController = new CategoryController(categoryService);

    app.group('/category', (app) => {
      app.get('', (context: IRequestContext) =>
        categoryController.getCategoriesWithPagination(context),
      );

      app.get('/:id', (context: IRequestContext) =>
        categoryController.getCategoryById(context),
      );

      app.post('', GUARD(RoleEnum.ADMIN), (context: IRequestContext) =>
        categoryController.createCategory(context),
      );

      app.patch('/:id', GUARD(RoleEnum.ADMIN), (context: IRequestContext) =>
        categoryController.updateCategory(context),
      );

      app.delete('/:id', GUARD(RoleEnum.ADMIN), (context: IRequestContext) =>
        categoryController.deleteCategory(context),
      );
    });
  }
}
