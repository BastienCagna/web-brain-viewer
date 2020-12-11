import * as THREE from "../dependencies/three.js/build/three.module.js";
import WBVToolBar from './WBVToolBar.js';
import { WBVWidget } from './WBVWidget.js';
import WBVViewManagerWidget from "./WBVViewManagerWidget.js";
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
        this.toolbar = new WBVToolBar(this.id, "View toolbar");
        this.widget = new WBVViewManagerWidget(this.toolbar.id);
        this.widget.view = this;
        if (this.parentId) {
            const parent = document.getElementById(this.parentId);
            this.height = (!height) ? parent.clientHeight : height;
            this.width = (!width) ? parent.clientWidth * 0.9 : width;
        }
        else {
            this.height = (!height) ? window.innerHeight : height;
            this.width = (!width) ? window.innerWidth : width;
        }
    }
    html() {
        let html = '<div id="' + this.id + '" class="wb-view">';
        html += '<div class="wbv-screen" id="' + this.id + '_screen"></div>';
        html += "<div class='wb-sidebar' id='" + this.toolbar.parentId + "_toolbar'></div>";
        html += '</div>';
        return html;
    }
    viewElement() {
        return document.getElementById(this.id + '_screen');
    }
    update() {
        super.update();
        this.toolbar.update();
    }
}
//# sourceMappingURL=WBView.js.map