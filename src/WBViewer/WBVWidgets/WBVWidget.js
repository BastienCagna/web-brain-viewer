import { MathUtils } from 'three';
var generateUUID = MathUtils.generateUUID;
export class WBVWidget {
    constructor(parent = null, classnames = []) {
        this.id = generateUUID();
        this.parent = parent;
        this.classnames = Array.isArray(classnames) ? classnames : [classnames];
        this.tag = "div";
    }
    update() {
        const classnames = this.classnames.join(' ');
        const divHTML = '<' + this.tag + ' id="' + this.id + '" class="' + classnames + '">' + this.innerHTML() + '</' + this.tag + '>';
        const el = document.getElementById(this.id);
        if (el) {
            el.outerHTML = divHTML;
        }
        else if (this.parent) {
            const parentElement = (this.parent instanceof Element) ? this.parent : document.getElementById(this.parent.id);
            if (parentElement) {
                parentElement.innerHTML += divHTML;
            }
        }
    }
}
//# sourceMappingURL=WBVWidget.js.map