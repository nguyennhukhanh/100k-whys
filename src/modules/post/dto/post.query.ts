import { HttpException } from '@thanhhoajs/thanhhoa';
import { createValidator } from '@thanhhoajs/validator';
import { CommonQuery } from 'src/shared/dto/common.query';

const postValidator = createValidator();
postValidator.field('authorId').optional().number().min(1);

export class PostQuery extends CommonQuery {
  authorId?: number;

  constructor(params: Partial<PostQuery> = {}) {
    super(params);

    this.authorId = params.authorId ? Number(params.authorId) : undefined;

    const errors = postValidator.validate(this);
    if (errors.length)
      throw new HttpException('Validation failed', 400, errors);
  }
}
