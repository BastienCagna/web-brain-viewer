import * as THREE from 'three';
import WBVToolBar from './WBVWidgets/WBVToolBar';
import { WBVWidget } from './WBVWidgets/WBVWidget';
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
    constructor(parent = null, width = null, height = null, classnames = []) {
        super(parent, classnames);
        this.toolbar = null;
        this.objects = [];
        this.height = null;
        this.width = null;
        this.viewWidget = null;
        this.classnames.push("wb-view");
        this.toolbar = new WBVToolBar();
        this.setDimensions(width, height);
        window.addEventListener('resize', this.setDimensions.bind(this), false);
        window.addEventListener('resize', this.onWindowResize.bind(this), false);
    }
    innerHTML() {
        return '';
    }
    viewElement() {
        return document.getElementById(this.id);
    }
    setDimensions(width = null, height = null) {
        width = (isNaN(width)) ? null : width;
        height = (isNaN(height)) ? null : height;
        let prt = null;
        if (this.parent) {
            prt = (this.parent instanceof Element) ? this.parent : document.getElementById(this.parent.id);
        }
        if (prt) {
            this.height = (!height) ? ((prt.clientHeight > 0) ? prt.clientHeight : window.innerHeight) : height;
            this.width = (!width) ? ((prt.clientWidth > 0) ? prt.clientWidth : window.innerWidth) : width;
        }
        else {
            this.height = (!height) ? window.innerHeight : height;
            this.width = (!width) ? window.innerWidth : width;
        }
        const parent = document.getElementById(this.id);
        if (parent) {
            const canvas = parent.firstChild;
            canvas.setAttribute('width', this.width.toString());
            canvas.setAttribute('height', this.height.toString());
        }
    }
    update() {
        super.update();
        this.viewWidget.update();
    }
}
//# sourceMappingURL=WBView.js.map