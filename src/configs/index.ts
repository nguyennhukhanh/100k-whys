import { Logger } from '@thanhhoajs/logger';

import { adminAuthConfig, adminAuthValidator } from './admin-auth.config';
import { appConfig, appValidator } from './app.config';
import { dbConfig, dbValidator } from './database.config';
import { userAuthConfig, userAuthValidator } from './user-auth.config';

const logger = Logger.get('CONFIGS');

export const runValidators = async () => {
  try {
    const results = await Promise.all([
      dbValidator.validate(dbConfig),
      appValidator.validate(appConfig),
      userAuthValidator.validate(userAuthConfig),
      adminAuthValidator.validate(adminAuthConfig),
    ]);

    const allErrors = results.filter((errors) => errors.length > 0);

    if (allErrors.length > 0) {
      logger.error('Validation errors:');
      logger.trace(allErrors);
      process.exit(1);
    } else {
      logger.success('All configurations are valid!');
    }
  } catch (error) {
    logger.error('An error occurred during validation:\n', error);
    process.exit(1);
  }
};
