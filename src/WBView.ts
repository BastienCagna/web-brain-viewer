/**
 * WBViewer
 *
 * Abstract class for 2D and 3D viewers
 * **/
import * as THREE from "../dependencies/three.js/build/three.module.js";
import WBVToolBar from './WBVToolBar.js';
import {WBVWidget} from './WBVWidget.js';
import {WBObject} from "./WBObject.js";
import WBVViewWidget from "./WBVViewWidget.js";

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
    origin: WB3DCross;
    height: number = null;
    width: number = null;
    viewWidget: WBVViewWidget = null;

    /**
     * Init the viewer: create the toolbar and if needed set default value to height and width.
     * @param parentId - Id of the parent HTML element
     * @param id - Id of the viewer
     * @param width - Width of the viewer in pixels. (Default: window's width)
     * @param height - Height of the viewer in pixels. (Default: window's height)
     * @protected
     */
    protected constructor(parentId: string = null, id: string = null, width: number = null,
                          height: number = null) {
        super(parentId, id);
        this.toolbar = new WBVToolBar();

        if (this.parentId) {
            const parent = document.getElementById(this.parentId);
            this.height = (!height) ? parent.clientHeight : height;
            this.width = (!width) ? parent.clientWidth : width;
        } else {
            this.height = (!height) ? window.innerHeight : height;
            this.width = (!width) ? window.innerWidth : width;
        }

        this.height = (this.height < 400) ? 400 : this.height;
        this.width = (this.width < 600) ? 600 : this.width;

        window.addEventListener('resize', this.onWindowResize, false);
    }

    html(): string {
        let html = '<div class="wb-view" id="' + this.id + '"></div>';
        return html;
    }

    viewElement(): HTMLElement {
        return document.getElementById(this.id);
    }

    abstract addObject(obj: WBObject): void;

    abstract removeObjectByName(name: string): void;

    abstract onWindowResize(): void;

    update() {
        super.update();
        this.viewWidget.update();
    }
}

