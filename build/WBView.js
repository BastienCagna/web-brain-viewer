import * as THREE from "../dependencies/three.js/build/three.module.js";
import WBVToolBar from './WBVToolBar.js';
import { WBVWidget } from './WBVWidget.js';
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
        this.viewWidget = null;
        this.toolbar = new WBVToolBar();
        if (this.parentId) {
            const parent = document.getElementById(this.parentId);
            this.height = (!height) ? ((parent.clientHeight > 0) ? parent.clientHeight : window.innerHeight) : height;
            this.width = (!width) ? ((parent.clientWidth > 0) ? parent.clientWidth : window.innerWidth) : width;
        }
        else {
            this.height = (!height) ? window.innerHeight : height;
            this.width = (!width) ? window.innerWidth : width;
        }
        console.log(this.height, this.width);
        this.height = (this.height < 400) ? 400 : this.height;
        this.width = (this.width < 600) ? 600 : this.width;
        console.log(this.height, this.width);
        window.addEventListener('resize', this.onWindowResize, false);
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
        this.viewWidget.update();
    }
}
//# sourceMappingURL=WBView.js.map