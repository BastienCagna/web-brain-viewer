import { WBVWidget } from "./WBVWidget.js";
export default class WBVToolBar extends WBVWidget {
    constructor(parentId = null, name = '') {
        super(parentId);
        this.collapsable = true;
        this.name = name;
        this.widgets = [];
    }
    html() {
        let html = '<div id="' + this.id + '" class="wbv-tb"></div>';
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