export interface IHelperStringPasswordOptions {
  length: number;
}

const stringHelper = {
  randomReference(length: number): string {
    const timestamp = `${new Date().getTime()}`;
    const randomString: string = this.random(length);

    return `${timestamp}${randomString}`.toUpperCase();
  },

  random(length: number): string {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    let counter = 0;
    while (counter < length) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );

      counter += 1;
    }

    return result;
  },

  censor(text: string): string {
    if (text.length <= 3) {
      const stringCensor: string = '*'.repeat(2);
      return `${stringCensor}${text.slice(-1)}`;
    } else if (text.length <= 10) {
      const stringCensor: string = '*'.repeat(7);
      return `${stringCensor}${text.slice(-3)}`;
    }

    const stringCensor: string = '*'.repeat(10);
    return `${text.slice(0, 3)}${stringCensor}${text.slice(-4)}`;
  },

  checkPasswordStrength(
    password: string,
    options?: IHelperStringPasswordOptions
  ): boolean {
    const length: number = options?.length ?? 8;
    const regex: RegExp = new RegExp(
      `^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{${length},}$`
    );

    return regex.test(password);
  },

  formatCurrency(num: number, locale: string): string {
    return num.toLocaleString(locale);
  },
};

export default stringHelper;
