import WBVSectionWidget from "./WBVSectionWidget";
export default class WBVMetaDataWidget extends WBVSectionWidget {
    constructor(parent = null, data = {}, classnames = []) {
        super(parent, 'Meta-data', classnames);
        this.data = data;
        this.hideWhenEmpty = true;
    }
    bodyHtml() {
        if (!this.data || Object.keys(this.data).length === 0)
            return null;
        let html = '<table class="3dview-object-list"><tbody>';
        for (const k of Object.keys(this.data).sort()) {
            html += '<tr><th>' + k + '</th><td>' + this.data[k] + '</td>';
        }
        html += '</tbody></table>';
        return html;
    }
    setData(data = {}) {
        this.data = data;
        this.update();
    }
}
//# sourceMappingURL=WBVMetaDataWidget.js.map