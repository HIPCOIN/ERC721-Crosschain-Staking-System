export function splitArray(array: any[], slice: number) {
  if (array.length <= slice) {
    return [array];
  }

  const result = [];
  for (let i = 0; i < array.length; i += slice) {
    result.push(array.slice(i, i + slice));
  }

  return result;
}
