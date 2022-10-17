function min(arr) {
    let vmin = Number.MAX_VALUE;
    for (const v of arr) {
        if (v < vmin)
            vmin = v;
    }
    return vmin;
}
function max(arr) {
    let vmax = -Number.MAX_VALUE;
    for (const v of arr) {
        if (v > vmax)
            vmax = v;
    }
    return vmax;
}
function argsort(arr, ascending = true, compareFn = (a, b) => (a[0] - b[0])) {
    const valuesAndIndexes = arr.map((v, i) => [v, i]);
    valuesAndIndexes.sort(compareFn);
    if (!ascending)
        valuesAndIndexes.reverse();
    return valuesAndIndexes.map((v, i) => v[1]);
}
function arange(n, step = 1) {
    let vect = [];
    for (let i = 0; i < n; i += step) {
        vect.push(i);
    }
    return vect;
}
function minmaxRange(min, max, step = 1) {
    let vect = [];
    for (let i = min; i < max; i += step) {
        vect.push(i);
    }
    return vect;
}
export { min, max, argsort, arange, minmaxRange };
//# sourceMappingURL=utils.js.map