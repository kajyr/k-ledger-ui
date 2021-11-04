export const omit = (obj: any, blacklist: string[]) =>
  Object.fromEntries(Object.entries(obj).filter(([key]) => !blacklist.includes(key)));
