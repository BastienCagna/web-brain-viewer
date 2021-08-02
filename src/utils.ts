function min(arr: number[]): number {
    let vmin = Number.MAX_VALUE;
    for(const v of arr) {
        // @ts-ignore
        if(v < vmin) vmin = v;
    }
    return vmin;
}

function max(arr: number[]): number {
    let vmax = -Number.MAX_VALUE;
    for(const v of arr) {
        // @ts-ignore
        if(v > vmax) vmax = v;
    }
    return vmax;
}

/**
 * Return indexes of sorted elements
 * src: https://stackoverflow.com/questions/46622486/what-is-the-javascript-equivalent-of-numpy-argsort
 */
function argsort(arr: number[], ascending:boolean=true, compareFn=(a, b) =>(a[0] - b[0])) {
    // Assign index to each value
    const valuesAndIndexes = arr.map((v, i) => [v, i]);
    // Sort by comparing values using the compare function
    valuesAndIndexes.sort(compareFn);
    // If descending order, reverse the sort output
    if(!ascending) valuesAndIndexes.reverse();
    // For each couple of sorted (value, index) return the index
    return valuesAndIndexes.map((v, i) => v[1]);
}

function arange(n: number, step: number = 1): number[] {
    let vect: number[] = [];
    for(let i = 0; i < n; i += step) {
        vect.push(i);
    }
    return vect;
}
function minmaxRange(min: number, max:number, step: number = 1): number[] {
    let vect: number[] = [];
    for(let i = min; i < max; i += step) {
        vect.push(i);
    }
    return vect;
}

export {min, max, argsort, arange, minmaxRange};
