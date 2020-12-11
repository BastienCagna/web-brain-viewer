import { WBVWidget } from "./WBVWidget.js";
export default class WBVToolBar extends WBVWidget {
    constructor(parentId = null, name = '') {
        super(parentId);
        this.collapsable = true;
        this.name = name;
        this.widgets = [];
    }
    html() {
        let html = '<div class="wbv-tb">';
        html += '<div class="wbv-tb-header" target-data="' + this.id + '"><h2>' + this.name + '</h2></div>';
        html += '<div id="' + this.id + '" class="wbv-tb-body"></div></div>';
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