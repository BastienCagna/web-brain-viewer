import { WBVWidget } from "./WBVWidget.js";

export default class WBVToolBar extends WBVWidget {
    name: string;
    collapsable = true;
    widgets: WBVWidget[];

    constructor(parentId: string = null, name = '') {
        super(parentId);
        this.name = name;
        this.widgets = [];
    }

    html(): string {
        let html = '<div id="' + this.id + '" class="wbv-tb"></div>';
        return html;
    }

    update() {
        super.update();
        for(const w of this.widgets) { w.update(); }
    }
}