import { createValidator } from '@thanhhoajs/validator';

const userAuthValidator = createValidator();

userAuthValidator.field('accessTokenSecret').required().string();
userAuthValidator.field('accessTokenLifetime').required().number();
userAuthValidator.field('refreshTokenSecret').required().string();
userAuthValidator.field('refreshTokenLifetime').required().number();

const userAuthConfig = {
  accessTokenSecret: process.env.USER_ACCESS_TOKEN_SECRET,
  accessTokenLifetime: Number(process.env.USER_ACCESS_TOKEN_LIFETIME),
  refreshTokenSecret: process.env.USER_REFRESH_TOKEN_SECRET,
  refreshTokenLifetime: Number(process.env.USER_REFRESH_TOKEN_LIFETIME),
};

export { userAuthConfig, userAuthValidator };
