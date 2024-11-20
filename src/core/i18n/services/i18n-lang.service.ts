import { I18nContext } from 'nestjs-i18n';
import helpers from '../../../utils/helpers';
import { Injectable } from '@nestjs/common';

@Injectable()
export class I18nLangService {
  async tran(
    keys: string | string[],
    throwException: boolean = true,
  ): Promise<Awaited<unknown>[]> {
    const i18n: I18nContext<Record<any, any>> | undefined =
      I18nContext.current();
    if (i18n) {
      return Promise.all(
        helpers.wrapArray(keys).map(async (key) => {
          return i18n.t(key);
        }),
      );
    }

    if (throwException) {
      throw new Error('I18N feature is currently unavailable.');
    }

    return [];
  }
}
