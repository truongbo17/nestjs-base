import { DateObjectUnits, DateTime, Duration } from 'luxon';

export enum ENUM_HELPER_DATE_DAY_OF {
  START = 'start',
  END = 'end',
}

interface IHelperDateCreateOptions {
  dayOf?: ENUM_HELPER_DATE_DAY_OF;
}

interface IHelperDateOptionsCreate {
  startOfDay?: boolean;
}

const dateHelper = {
  calculateAge(dateOfBirth: Date, fromYear?: number): Duration {
    const dateTime = DateTime.now()
      .setZone(process.env.TZ)
      .plus({
        day: 1,
      })
      .set({
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
      });
    const dateTimeDob = DateTime.fromJSDate(dateOfBirth)
      .setZone(process.env.TZ)
      .set({
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
      });

    if (fromYear) {
      dateTime.set({
        year: fromYear,
      });
    }

    return dateTime.diff(dateTimeDob);
  },

  checkIso(date: string): boolean {
    return DateTime.fromISO(date).setZone(process.env.TZ).isValid;
  },

  checkTimestamp(timestamp: number): boolean {
    return DateTime.fromMillis(timestamp).setZone(process.env.TZ).isValid;
  },

  getZone(date: Date): string {
    return DateTime.fromJSDate(date).setZone(process.env.TZ).zone.name;
  },

  getZoneOffset(date: Date): string {
    return <string>(
      DateTime.fromJSDate(date).setZone(process.env.TZ).offsetNameShort
    );
  },

  getTimestamp(date: Date): number {
    return DateTime.fromJSDate(date).setZone(process.env.TZ).toMillis();
  },

  formatToRFC2822(date: Date): string {
    return <string>(
      DateTime.fromJSDate(date).setZone(process.env.TZ).toRFC2822()
    );
  },

  formatToIso(date: Date): string {
    return <string>DateTime.fromJSDate(date).setZone(process.env.TZ).toISO();
  },

  formatToIsoDate(date: Date): string {
    return <string>(
      DateTime.fromJSDate(date).setZone(process.env.TZ).toISODate()
    );
  },

  formatToIsoTime(date: Date): string {
    return <string>(
      DateTime.fromJSDate(date).setZone(process.env.TZ).toISOTime()
    );
  },

  create(date?: Date, options?: IHelperDateCreateOptions): Date {
    const mDate = date
      ? DateTime.fromJSDate(date).setZone(process.env.TZ)
      : DateTime.now().setZone(process.env.TZ);

    if (options?.dayOf && options?.dayOf === ENUM_HELPER_DATE_DAY_OF.START) {
      mDate.startOf('day');
    } else if (
      options?.dayOf &&
      options?.dayOf === ENUM_HELPER_DATE_DAY_OF.END
    ) {
      mDate.endOf('day');
    }

    return mDate.toJSDate();
  },

  createInstance(date?: Date): DateTime {
    return date ? DateTime.fromJSDate(date) : DateTime.now();
  },

  createFromIso(iso: string, options?: IHelperDateCreateOptions): Date {
    const date = DateTime.fromISO(iso).setZone(process.env.TZ);

    if (options?.dayOf && options?.dayOf === ENUM_HELPER_DATE_DAY_OF.START) {
      date.startOf('day');
    } else if (
      options?.dayOf &&
      options?.dayOf === ENUM_HELPER_DATE_DAY_OF.END
    ) {
      date.endOf('day');
    }

    return date.toJSDate();
  },

  createFromTimestamp(
    timestamp?: number,
    options?: IHelperDateCreateOptions
  ): Date {
    const date = timestamp
      ? DateTime.fromMillis(timestamp).setZone(process.env.TZ)
      : DateTime.now().setZone(process.env.TZ);

    if (options?.dayOf && options?.dayOf === ENUM_HELPER_DATE_DAY_OF.START) {
      date.startOf('day');
    } else if (
      options?.dayOf &&
      options?.dayOf === ENUM_HELPER_DATE_DAY_OF.END
    ) {
      date.endOf('day');
    }

    return date.toJSDate();
  },

  set(date: Date, units: DateObjectUnits): Date {
    return DateTime.fromJSDate(date)
      .setZone(process.env.TZ)
      .set(units)
      .toJSDate();
  },

  forward(date: Date, duration: Duration): Date {
    return DateTime.fromJSDate(date)
      .setZone(process.env.TZ)
      .plus(duration)
      .toJSDate();
  },

  backward(date: Date, duration: Duration): Date {
    return DateTime.fromJSDate(date)
      .setZone(process.env.TZ)
      .minus(duration)
      .toJSDate();
  },

  timestamp(
    date?: string | number | Date,
    options?: IHelperDateOptionsCreate
  ): number {
    let mDate: DateTime;

    if (date) {
      mDate = DateTime.fromJSDate(new Date(date));
    } else {
      mDate = DateTime.now();
    }

    if (options?.startOfDay) {
      mDate = mDate.startOf('day');
    }

    return mDate.toMillis();
  },
};

export default dateHelper;
