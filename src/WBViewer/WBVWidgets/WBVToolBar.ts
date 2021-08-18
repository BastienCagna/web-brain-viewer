import { WBVWidget } from "./WBVWidget";

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
    constructor(parent : WBVWidget|HTMLElement = null, name : string = null, classnames: string[]|string = []) {
        super(parent, classnames);
        this.classnames.push("wbv-tb");
        this.name = (name)? name : "Toolbar";
        this.widgets = [];
    }

    /**
     * Generate an empty div.
     */
    innerHTML(): string {
        let html = '';
        //for(const w of this.widgets) { html += w.innerHTML(); }
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
