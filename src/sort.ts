export function sortByKey(first: [string, string], second: [string, string]): number {
  return first[0] < second[0] ? -1 : first[0] > second[0] ? 1 : 0;
}

export function sortBySelf(first: string, second: string): number {
  return first < second ? -1 : first > second ? 1 : 0;
}
