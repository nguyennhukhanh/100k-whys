import { HttpException } from '@thanhhoajs/thanhhoa';
import { createValidator } from '@thanhhoajs/validator';

const validator = createValidator();
validator.field('name').required().string().length(3, 100);
validator.field('description').required().string();

export class CategoryCreate {
  name: string;
  description: string;

  constructor(params: { name: string; description: string }) {
    this.name = params.name;
    this.description = params.description;
    this.validate();
  }

  private validate() {
    const errors = validator.validate(this);
    if (errors.length > 0) {
      throw new HttpException('Validation failed', 400, errors);
    }
  }
}
