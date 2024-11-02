import { CommonQuery } from 'src/shared/dto/common.query';

export class CategoryQuery extends CommonQuery {
  constructor(params: Partial<CategoryQuery> = {}) {
    super(params);
  }
}