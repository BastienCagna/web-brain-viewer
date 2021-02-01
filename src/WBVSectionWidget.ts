import {WBVWidget} from "./WBVWidget.js";

export default abstract class WBVSectionWidget extends WBVWidget {
    title: string;
    hideWhenEmpty = false;

    protected constructor(parentId:string = null, title:string = null) {
        super(parentId);
        this.title = title;
    }

    abstract bodyHtml(): string;

    html(): string {
        const body = this.bodyHtml();
        if(this.hideWhenEmpty && !body) return '<section id="' + this.id + '" style="display: none;"></section>';

        let html = '<section id="' + this.id + '">';
        html += '<h3 data-toggle="collapse" data-target="#' + this.id + '_body">' + this.title + '</h3>';
        html += '<div id="' + this.id + '_body" class="collapse show wb-section-body">' + body + '</div>';
        html += '</section>';
        return html;
    }
}
