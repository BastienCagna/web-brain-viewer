import * as THREE from 'three';
declare class WBColorBar {
    canvas: any;
    context: any;
    cmap: WBColorMap;
    unit: string;
    nTicks: number;
    width: number;
    height: number;
    constructor(canvas: any, cmap: WBColorMap, unit?: string, nTicks?: number);
    draw(unit?: string, nTicks?: any): void;
    clear(): void;
}
declare abstract class WBColorMap {
    vmin: number;
    vmax: number;
    constructor(vmin?: number, vmax?: number);
    abstract color(value: number): THREE.Color;
    abstract colors(arr: number[]): THREE.Color[];
    resetBoundaries(vmin?: any, vmax?: any): void;
}
declare class WBBasicColorMap extends WBColorMap {
    color(value: number, options?: {}): THREE.Color;
    colors(arr: number[], options?: {}): any[];
}
export { WBColorBar, WBColorMap, WBBasicColorMap };
