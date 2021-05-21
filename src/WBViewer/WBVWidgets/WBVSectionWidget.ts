import {WBVWidget} from "./WBVWidget.js";

export default abstract class WBVSectionWidget extends WBVWidget {
    title: string;
    hideWhenEmpty = false;

    protected constructor(parent : WBVWidget|HTMLElement = null, title : string = null,
                          classnames : string[]|string = []) {
        super(parent, classnames);
        this.tag = "section";
        this.title = title;
    }

    abstract bodyHtml(): string;

    innerHTML(): string {
        const body = this.bodyHtml();
        let html = '<h3 data-toggle="collapse" data-target="#' + this.id + '_body">' + this.title + '</h3>';
        html += '<div id="' + this.id + '_body" class="collapse show wb-section-body">' + body + '</div>';
        return html;
    }

    update() {
        super.update();
        const el = document.getElementById(this.id);
        if(el) el.hidden = this.hideWhenEmpty && !this.bodyHtml();
    }
}
