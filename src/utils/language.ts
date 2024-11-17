import { I18nContext } from 'nestjs-i18n';
import wrapArray from './helpers';

async function tran(
  keys: string | string[],
  throwException: boolean = true,
): Promise<Awaited<unknown>[]> {
  const i18n = I18nContext.current();
  if (i18n) {
    return Promise.all(
      wrapArray(keys).map(async (key) => {
        return i18n.t(key);
      }),
    );
  }

  if (throwException) {
    throw new Error('I18N feature is currently unavailable.');
  }

  return [];
}

export default tran;
