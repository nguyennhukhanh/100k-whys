import { HttpException } from '@thanhhoajs/thanhhoa';
import { createValidator } from '@thanhhoajs/validator';

function isValidImage(imageName: string): boolean {
  const imageRegex = /\.(jpg|jpeg|png|gif|bmp|webp)$/i;
  return imageRegex.test(imageName);
}

const validator = createValidator();
validator.field('title').optional().string().length(3, 255);
validator.field('content').optional().string();
validator
  .field('categoryIds')
  .optional()
  .custom(
    (value) => Array.isArray(value) && value.length > 0,
    'CategoryIds must be an array and not empty',
  );
validator.field('publishedAt').optional().date('Invalid publishedAt format');
validator
  .field('file')
  .optional()
  .custom(
    (value) =>
      value instanceof File &&
      value.size > 0 &&
      value.size < 10 * 1024 * 1024 &&
      isValidImage(value.name),
    'Invalid file format (Image must be jpg, jpeg, gif, bmp, webp or png and less than 10MB)',
  );

export class PostUpdate {
  title?: string;
  content?: string;
  categoryIds?: number[] = [];
  publishedAt?: Date;
  file?: File;

  constructor(params: Partial<PostUpdate> = {}) {
    this.title = params?.title;
    this.content = params?.content;
    this.categoryIds = params?.categoryIds;
    this.publishedAt = params.publishedAt
      ? new Date(params.publishedAt)
      : new Date();
    this.file = params?.file;

    const errors = validator.validate(this);
    if (errors.length > 0) {
      throw new HttpException('Validation failed', 400, errors);
    }
  }
}
