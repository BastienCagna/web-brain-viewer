import { WBVWidget } from "./WBVWidget";
export default class WBVSectionWidget extends WBVWidget {
    constructor(parent = null, title = null, classnames = []) {
        super(parent, classnames);
        this.hideWhenEmpty = false;
        this.tag = "section";
        this.title = title;
    }
    innerHTML() {
        const body = this.bodyHtml();
        let html = '<h3 data-toggle="collapse" data-target="#' + this.id + '_body">' + this.title + '</h3>';
        html += '<div id="' + this.id + '_body" class="collapse show wb-section-body">' + body + '</div>';
        return html;
    }
    update() {
        super.update();
        const el = document.getElementById(this.id);
        if (el)
            el.hidden = this.hideWhenEmpty && !this.bodyHtml();
    }
    HTMLElement() {
        return document.getElementById(this.id);
    }
}
//# sourceMappingURL=WBVSectionWidget.js.map