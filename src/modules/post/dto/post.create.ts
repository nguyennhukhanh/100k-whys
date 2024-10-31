import { HttpException } from '@thanhhoajs/thanhhoa';
import { createValidator } from '@thanhhoajs/validator';

function isValidImage(imageName: string): boolean {
  const imageRegex = /\.(jpg|jpeg|png|gif|bmp|webp)$/i;
  return imageRegex.test(imageName);
}

const validator = createValidator();
validator.field('title').required().string().length(3, 255);
validator.field('content').required().string();
validator
  .field('file')
  .required()
  .custom(
    (value) =>
      value instanceof File &&
      value.size > 0 &&
      value.size < 10 * 1024 * 1024 &&
      isValidImage(value.name),
    'Invalid file format (Image must be jpg, jpeg, gif, bmp, webp or png and less than 10MB)',
  );

export class PostCreate {
  title: string;
  content: string;
  file: File;

  constructor(params: { title: string; content: string; file: File }) {
    this.title = params.title;
    this.content = params.content;
    this.file = params.file;
    this.validate();
  }

  private validate() {
    const errors = validator.validate(this);
    if (errors.length > 0) {
      throw new HttpException('Validation failed', 400, errors);
    }
  }
}
