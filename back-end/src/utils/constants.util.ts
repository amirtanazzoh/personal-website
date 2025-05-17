export const TIME = {
  MILLISECOND: 1,
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000,
};

export const SIZE = {
  BYTE: 1,
  KILOBYTE: 1024,
  MEGABYTE: 1024 * 1024,
  GIGABYTE: 1024 * 1024 * 1024,
  TERABYTE: 1024 * 1024 * 1024 * 1024,
};

/***********************************************/
export const APP_THROTTLER = {
  ttl: 1 * TIME.SECOND,
  limit: 20,
};
