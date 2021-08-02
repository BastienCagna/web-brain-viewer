/**
 * WBViewer
 *
 * Abstract class for 2D and 3D viewers
 * **/
// @ts-ignore
import * as THREE from "https://unpkg.com/three@0.126.1/build/three.module.js";
import WBVToolBar from './WBVWidgets/WBVToolBar.js';
import {WBVWidget} from './WBVWidgets/WBVWidget.js';
import {WBObject} from "../WBObjects/WBObject.js";
import WBVViewWidget from "./WBVWidgets/WBVViewWidget.js";

/**
 * 3D cross. Can also be used for 2D cross display.
 */
class WB3DCross extends THREE.Vector3 {
    vector = null;
    visible = false;
    color: THREE.Color;

    constructor(x= 0, y= 0, z= 0) {
        super(x, y, z);
    }

    setPosition(x, y, z): void {
        this.vector.x = x;
        this.vector.y = y;
        this.vector.z = z;
    }
}


/**
 * Abstract viewer.
 */
export abstract class WBView extends WBVWidget {
    /** Viewer name **/
    title: string;
    /** Viewer type (ex: 2D or 3D) **/
    type: string;
    /** Toolbar dedicated to this viewer. **/
    toolbar = null;
    /** List of all object included in the view **/
    objects = [];
    mouse: THREE.Vector2;
    cursor: WB3DCross;
    // origin: WB3DCross;
    height: number = null;
    width: number = null;
    viewWidget: WBVViewWidget = null;

    /**
     * Init the viewer: create the toolbar and if needed set default value to height and width.
     * @param parent -
     * @param width - Width of the viewer in pixels. (Default: window's width)
     * @param height - Height of the viewer in pixels. (Default: window's height)
     * @protected
     */
    protected constructor(parent: WBVWidget|HTMLElement = null, width: number = null, height: number = null,
                          classnames: string[]|string = []) {
        super(parent, classnames);
        this.classnames.push("wb-view");
        this.toolbar = new WBVToolBar();
        this.setDimensions(width, height);
        window.addEventListener('resize', this.setDimensions.bind(this), false);
        window.addEventListener('resize', this.onWindowResize.bind(this), false);
    }

    innerHTML(): string {
        return '';
    }

    viewElement(): HTMLElement {
        return document.getElementById(this.id);
    }

    setDimensions(width: number = null, height: number = null): void {
        width = (isNaN(width))? null : width;
        height = (isNaN(height))? null : height;
        let prt = null;
        if(this.parent) {
            prt = (this.parent instanceof Element) ? this.parent : document.getElementById(this.parent.id);
        }
        if (prt) {
            this.height = (!height) ? ((prt.clientHeight > 0) ? prt.clientHeight: window.innerHeight) : height;
            this.width = (!width) ? ((prt.clientWidth > 0) ? prt.clientWidth : window.innerWidth) : width;
        } else {
            this.height = (!height) ? window.innerHeight : height;
            this.width = (!width) ? window.innerWidth : width;
        }

        const parent = document.getElementById(this.id);
        if(parent) {
            const canvas = <HTMLElement>parent.firstChild;
            canvas.setAttribute('width', this.width.toString());
            canvas.setAttribute('height', this.height.toString());
        }
    }

    abstract addObject(obj: WBObject): void;

    abstract removeObjectByName(name: string): void;

    abstract onWindowResize(): void;

    update() {
        super.update();
        this.viewWidget.update();
    }
}

