import { HttpException } from '@thanhhoajs/thanhhoa';
import { createValidator } from '@thanhhoajs/validator';

const validator = createValidator();
validator.field('content').required().string();

export class CommentCreate {
  content: string;

  constructor(content: string) {
    this.content = content;

    const errors = validator.validate(this);
    if (errors.length > 0) {
      throw new HttpException('Validation failed', 400, errors);
    }
  }
}
