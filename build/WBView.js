import * as THREE from "../dependencies/three.js/build/three.module.js";
import WBVToolBar from './WBVToolBar.js';
import { WBVWidget } from './WBVWidget.js';
import WBVViewWidget from "./WBVViewWidget.js";
class WB3DCross extends THREE.Vector3 {
    constructor(x = 0, y = 0, z = 0) {
        super(x, y, z);
        this.vector = null;
        this.visible = false;
    }
    setPosition(x, y, z) {
        this.vector.x = x;
        this.vector.y = y;
        this.vector.z = z;
    }
}
export class WBView extends WBVWidget {
    constructor(parentId = null, id = null, width = null, height = null) {
        super(parentId, id);
        this.toolbar = null;
        this.objects = [];
        this.height = null;
        this.width = null;
        this.widget = null;
        this.toolbar = new WBVToolBar();
        if (this.parentId) {
            const parent = document.getElementById(this.parentId);
            this.height = (!height) ? parent.clientHeight : height;
            this.width = (!width) ? parent.clientWidth * .98 : width;
        }
        else {
            this.height = (!height) ? window.innerHeight : height;
            this.width = (!width) ? window.innerWidth : width;
        }
    }
    html() {
        let html = '<div class="wb-view" id="' + this.id + '"></div>';
        return html;
    }
    viewElement() {
        return document.getElementById(this.id);
    }
    update() {
        super.update();
        if (!this.widget) {
            console.log("hlo");
            this.widget = new WBVViewWidget(this);
            this.toolbar.widgets.push(this.widget);
        }
        this.widget.update();
    }
}
//# sourceMappingURL=WBView.js.map