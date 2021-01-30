import WBVSectionWidget from "./WBVSectionWidget.js";


/**
 * Widget that display metadata (key/values)
 */
export default class WBVMetaDataWidget extends WBVSectionWidget {
    data: {};

    /**
     *
     * @param data - Dictionary to display
     */
    constructor(data = {}) {
        super(null, 'Meta-data');
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
}
