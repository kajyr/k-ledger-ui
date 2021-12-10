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

type Temp = { value: string; count: number };

export function sortByOccurrence(list: string[]): string[] {
  const result: Temp[] = [];
  let count = 0;

  list.sort();

  for (let i = 0; i < list.length; i++) {
    count++;
    if (list[i] != list[i + 1]) {
      result.push({
        count: count,
        value: list[i],
      });
      count = 0;
    }
  }

  result.sort((a, b) => b.count - a.count);

  return result.map((item) => item.value);
}
