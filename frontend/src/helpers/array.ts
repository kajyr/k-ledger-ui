export function unique<T>(list: T[]): T[] {
  return Array.from(new Set(list));
}

export function dedupe<T>(list: T[], mkKey: (item: T) => string): T[] {
  const map = list.reduce((acc, cur) => {
    const key = mkKey(cur);
    if (!acc[key]) {
      acc[key] = cur;
    }
    return acc;
  }, {});

  return Object.values(map);
}
