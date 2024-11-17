import { ClassConstructor } from 'class-transformer/types/interfaces';
import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';

function validateConfig<T extends object>(
  config: Record<string, unknown>,
  envVariablesClass: ClassConstructor<T>,
): T {
  const validateConfig: T = plainToClass(envVariablesClass, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validateConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validateConfig;
}

export default validateConfig;
