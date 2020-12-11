/**
 * WBViewer
 *
 * Abstract class for 2D and 3D viewers
 * **/
import * as THREE from "../dependencies/three.js/build/three.module.js";
import WBVToolBar from './WBVToolBar.js';
import {WBVWidget} from './WBVWidget.js';
import {WBObject} from "./WBObject.js";
import WBVViewManagerWidget from "./WBVViewManagerWidget.js";

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


export abstract class WBView extends WBVWidget {
    title: string;
    type: string;
    toolbar = null;
    objects = [];
    mouse: THREE.Vector2;
    cursor: WB3DCross;
    origin: WB3DCross;
    height:number = null;
    width: number = null;
    widget: WBVViewManagerWidget;


    protected constructor(parentId: string = null, id: string = null, width:number = null,
                          height:number = null) {
        super(parentId, id);
        this.toolbar = new WBVToolBar(this.id, "View toolbar");
        this.widget = new WBVViewManagerWidget(this.toolbar.id);
        this.widget.view = this;

        if(this.parentId) {
            const parent = document.getElementById(this.parentId);
            this.height = (!height) ? parent.clientHeight: height;
            // FIXME: canvas if too large without *0.9
            this.width = (!width) ? parent.clientWidth * 0.9  : width;
        }
        else {
            this.height = (!height) ? window.innerHeight : height;
            this.width = (!width) ? window.innerWidth : width;
        }
    }

    html(): string {
        let html = '<div id="' + this.id + '" class="wb-view">';
        html += '<div class="wbv-screen" id="' + this.id + '_screen"></div>';
        html += "<div class='wb-sidebar' id='" + this.toolbar.parentId + "_toolbar'></div>";
        html += '</div>';
        return html;
    }

    viewElement(): HTMLElement {
        return document.getElementById(this.id + '_screen');
    }

    abstract addObject(obj: WBObject): void;

    update() {
        super.update();
        this.toolbar.update();
    }
}
