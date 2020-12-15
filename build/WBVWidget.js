import { MathUtils } from "../dependencies/three.js/build/three.module.js";
var generateUUID = MathUtils.generateUUID;
export class WBVWidget {
    constructor(parentId = null, id = null) {
        this.id = null;
        this.parentId = null;
        this.id = (!id) ? generateUUID() : id;
        this.parentId = parentId;
    }
    update() {
        const el = document.getElementById(this.id);
        if (el) {
            el.outerHTML = this.html();
        }
        else if (this.parentId) {
            const parent = document.getElementById(this.parentId);
            if (parent) {
                parent.innerHTML += this.html();
            }
        }
    }
}
//# sourceMappingURL=WBVWidget.js.map