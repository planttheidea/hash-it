export function sortByKey(
  first: [string, string],
  second: [string, string],
): boolean {
  return first[0] > second[0];
}

export function sortBySelf(first: string, second: string) {
  return first > second;
}

export default function sort(
  array: any[],
  fn: (item: any, comparisonItem: any) => boolean,
) {
  let subIndex;
  let value;

  for (let index = 0; index < array.length; ++index) {
    value = array[index];

    for (
      subIndex = index - 1;
      ~subIndex && fn(array[subIndex], value);
      --subIndex
    ) {
      array[subIndex + 1] = array[subIndex];
    }

    array[subIndex + 1] = value;
  }

  return array;
}
