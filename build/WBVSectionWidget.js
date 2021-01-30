import { WBVWidget } from "./WBVWidget.js";
export default class WBVSectionWidget extends WBVWidget {
    constructor(parentId = null, title = null) {
        super(parentId);
        this.hideWhenEmpty = false;
        this.title = title;
    }
    html() {
        const body = this.bodyHtml();
        if (this.hideWhenEmpty && !body)
            return '<section id="' + this.id + '" style="display: none;"></section>';
        let html = '<section id="' + this.id + '">';
        html += '<h3>' + this.title + '</h3>';
        html += '<div class="wb-section-body">' + body + '</div>';
        html += '</section>';
        return html;
    }
}
//# sourceMappingURL=WBVSectionWidget.js.map