export function calcMax(numbers: number[]): number {
  let max = Number.MIN_VALUE;

  for (const num of numbers) {
    if (num > max) { max = num; }
  }

  return max;
}

export function calcMin(numbers: number[]): number {
  let min = Number.MAX_VALUE;

  for (const num of numbers) {
    if (num < min) { min = num; }
  }

  return min;
}
