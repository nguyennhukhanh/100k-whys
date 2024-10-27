import { HttpException } from '@thanhhoajs/thanhhoa';
import { createValidator } from '@thanhhoajs/validator';

const validator = createValidator();

validator.field('email').required().email();
validator.field('password').required().min(6);

class ValidateUserDto {
  email: string;
  password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}

async function validateUserDto(dto: ValidateUserDto) {
  const errors = await validator.validate(dto);
  if (errors.length > 0) {
    throw new HttpException('Validation failed', 400, errors);
  }
}
export { ValidateUserDto, validateUserDto };
