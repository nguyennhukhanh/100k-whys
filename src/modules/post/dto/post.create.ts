import { HttpException } from '@thanhhoajs/thanhhoa';
import { createValidator } from '@thanhhoajs/validator';

const validator = createValidator();
validator.field('title').required().string().length(3, 255);
validator.field('content').required().string();

export class PostCreate {
  title: string;
  content: string;

  constructor(params: { title: string; content: string }) {
    this.title = params.title;
    this.content = params.content;
    this.validate();
  }

  private validate() {
    const errors = validator.validate(this);
    if (errors.length > 0) {
      throw new HttpException('Validation failed', 400, errors);
    }
  }
}
