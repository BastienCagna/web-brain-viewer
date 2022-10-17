import { WBVWidget } from "./WBVWidget";
export default class WBVToolBar extends WBVWidget {
    constructor(parent = null, name = null, classnames = []) {
        super(parent, classnames);
        this.collapsable = true;
        this.classnames.push("wbv-tb");
        this.name = (name) ? name : "Toolbar";
        this.widgets = [];
    }
    innerHTML() {
        let html = '';
        return html;
    }
    update() {
        super.update();
        for (const w of this.widgets) {
            w.update();
        }
    }
}
//# sourceMappingURL=WBVToolBar.js.map