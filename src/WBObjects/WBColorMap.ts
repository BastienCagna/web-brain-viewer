import * as THREE from 'three'; //"https://unpkg.com/three@0.126.1/build/three.module";
import {max, min, minmaxRange} from "../utils";


class WBColorBar {
    canvas;
    context;
    cmap: WBColorMap;
    unit: string;
    nTicks: number;
    width: number;
    height: number;

    constructor(canvas, cmap: WBColorMap, unit:string=undefined, nTicks:number=undefined) {
        this.canvas = canvas;
        this.cmap = cmap;
        this.unit = unit;
        this.nTicks = nTicks;
        const size = canvas.getBoundingClientRect();
        this.width = size.width;
        this.height = size.height;
        this.context = canvas.getContext("2d");

        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.canvas.style.background = 'rgba(232, 230, 230, 0.45)';
        this.canvas.style.borderRadius = '4px';
        this.clear();
    }

    draw(unit:string=undefined, nTicks=undefined): void {
        unit = unit ? unit : this.unit ? this.unit : undefined;
        nTicks = nTicks ? nTicks : this.nTicks ? nTicks : 3;

        this.clear();
        this.context.save();
        // Width of the left space (used to print the unit)
        const uw = unit ? 20 : 2;
        // Height of the padding
        const dh = 5;
        // Height of the color bar
        const ch = this.height - 2*dh;
        // Width of the color bar
        const cw = 20;
        // Line width of the ticks
        const lw = 3;
        // Width of the ticks lines
        const ticksWidth = 10;

        // TODO: plot in reverse order (high value up and small down)
        const imgData = this.context.createImageData(cw, ch);
        let step = (this.cmap.vmax - this.cmap.vmin) / (ch + 1);
        const colors = this.cmap.colors(minmaxRange(this.cmap.vmin, this.cmap.vmax * (1+step), step));
        let i = 0, r, g, b;
        for (let v = 0; v < ch; v += 1) {
            r = colors[v].r * 255;
            g = colors[v].g * 255;
            b = colors[v].b * 255;
            for (let u = 0; u < cw+1; u += 1) {
                i = 4 * u + (v * cw * 4);
                imgData.data[i + 0] = r;
                imgData.data[i + 1] = g;
                imgData.data[i + 2] = b;
                imgData.data[i + 3] = 255;
            }
        }
        this.context.putImageData(imgData, uw, dh);

        // Ticks
        const tickRatio = (this.height-2*dh-lw) / (this.cmap.vmax - this.cmap.vmin);
        step = (this.cmap.vmax-this.cmap.vmin)/(nTicks-1);
        const ticks = minmaxRange(this.cmap.vmin, this.cmap.vmax + step, step);
        this.context.lineWidth = lw;
        this.context.font = "14px Arial";
        this.context.textAlign = "left";
        let y, str;
        let isFloat = false;
        for(const t of ticks) if(!Number.isInteger(t)) { isFloat = true; break; }
        for(const t of ticks) {
            this.context.strokeStyle = '#' + this.cmap.color(t).getHexString();
            this.context.beginPath();
            y = dh + (t-this.cmap.vmin) * tickRatio + lw/2;
            this.context.moveTo(uw+cw, y);
            this.context.lineTo(uw+cw+ticksWidth, y);
            this.context.stroke();
            str = String( isFloat ? t.toFixed(2) : t);
            this.context.fillText(str, uw+cw+ticksWidth+2, y + 5);
        }

        this.context.restore();
        if(unit) {
            this.context.font = "14px Arial";
            this.context.textAlign = "center";
            this.context.save();
            this.context.translate(16, this.height/2);
            this.context.rotate(-Math.PI / 2);
            this.context.fillText(unit, 0, 0);
            this.context.restore();
        }

        this.canvas.style.display = 'block';
    }

    clear(): void {
        this.canvas.style.display = 'none';
        this.context.clearRect(0, 0, this.width, this.height);
    }
}

abstract class WBColorMap {
    vmin: number;
    vmax: number;
    constructor(vmin:number=undefined, vmax:number=undefined) {
        this.vmin = vmin;
        this.vmax = vmax;
    }
    abstract  color(value: number) : THREE.Color;
    abstract  colors(arr: number[]) : THREE.Color[];

    resetBoundaries(vmin = undefined, vmax = undefined) {
        this.vmax = vmax;
        this.vmin = vmin;
    }

}

class WBBasicColorMap extends WBColorMap {
    color(value: number, options={}) {
        const vmin = (options['vmin']!==undefined) ? options['vmin'] : this.vmin;
        const vmax = (options['vmax']!==undefined) ? options['vmax'] : this.vmax;
        let x = (value - vmin) / (vmax - vmin);
        x = (x > 1) ? 1 : x;
        x = (x < 0) ? 0 : x;
        return new THREE.Color(x, 0, 1-x);
    }

    colors(arr: number[], options={}) {
        this.vmin = (options['vmin']!==undefined) ? options['vmin'] : (this.vmin!==undefined) ? this.vmin : min(arr);
        this.vmax = (options['vmax']!==undefined) ? options['vmax'] : (this.vmax!==undefined) ? this.vmax : max(arr);
        const colors = [];
        for(const v of arr) {
            colors.push(this.color(v));
        }
        return colors;
    }
}

// TODO: implement viridis/jet style cmap

export { WBColorBar, WBColorMap, WBBasicColorMap };
