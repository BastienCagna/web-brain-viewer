declare function min(arr: number[]): number;
declare function max(arr: number[]): number;
declare function argsort(arr: number[], ascending?: boolean, compareFn?: (a: any, b: any) => number): number[];
declare function arange(n: number, step?: number): number[];
declare function minmaxRange(min: number, max: number, step?: number): number[];
export { min, max, argsort, arange, minmaxRange };
