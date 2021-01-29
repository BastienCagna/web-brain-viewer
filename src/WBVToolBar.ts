import { WBVWidget } from "./WBVWidget.js";

/**
 * WBWidget that have a name and group a set of WBWidget.
 */
export default class WBVToolBar extends WBVWidget {
    name: string;
    collapsable = true;
    widgets: WBVWidget[];

    /**
     * Set the the name and an empty list of widgets.
     * @param parentId - Id of the parent HTML element.
     * @param name - Toolbar's name.
     */
    constructor(parentId: string = null, name = '') {
        super(parentId);
        this.name = name;
        this.widgets = [];
    }

    /**
     * Generate an empty div.
     */
    html(): string {
        let html = '<div id="' + this.id + '" class="wbv-tb"></div>';
        return html;
    }

    /**
     * Update each widgets.
     */
    update() {
        super.update();
        for(const w of this.widgets) { w.update(); }
    }
}