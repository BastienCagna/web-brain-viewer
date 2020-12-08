import { WBVWidget } from "./WBVWidget.js";
export default class WBVSectionWidget extends WBVWidget {
    constructor(parentId = null, title = null) {
        super(parentId);
        this.title = title;
    }
    html() {
        let html = '<section id="' + this.id + '">';
        html += '<h3>' + this.title + '</h3>';
        html += '<div class="wb-section-body">' + this.bodyHtml() + '</div>';
        html += '</section>';
        return html;
    }
}
//# sourceMappingURL=WBVSectionWidget.js.map