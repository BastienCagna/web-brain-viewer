import WBVSectionWidget from "./WBVSectionWidget.js";
import {WBVWidget} from "./WBVWidget";


/**
 * Widget that display metadata (key/values)
 */
export default class WBVMetaDataWidget extends WBVSectionWidget {
    data: {};

    /**
     *
     * @param data - Dictionary to display
     */
    constructor(parent: WBVWidget|HTMLElement = null, data = {}, classnames : string[]|string = []) {
        super(parent, 'Meta-data', classnames);
        this.data = data;
        this.hideWhenEmpty = true;
    }

    /**
     * Generate the table that list properties.
     */
    bodyHtml(): string {
        if(!this.data || Object.keys(this.data).length === 0) return null;

        let html = '<table class="3dview-object-list"><tbody>';
        for(const k of Object.keys(this.data).sort()) {
            html += '<tr><th>' + k + '</th><td>' + this.data[k] + '</td>';
        }
        html += '</tbody></table>';
        return html;
    }

    setData(data = {}): void {
        this.data = data;
        this.update();
    }
}
