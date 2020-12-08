import {WBVWidget} from "./WBVWidget.js";

export default abstract class WBVSectionWidget extends WBVWidget {
    title: string;

    protected constructor(parentId:string = null, title:string = null) {
        super(parentId);
        this.title = title;
    }

    abstract bodyHtml(): string;

    html(): string {
        let html = '<section id="' + this.id + '">';
        html += '<h3>' + this.title + '</h3>';
        html += '<div class="wb-section-body">' + this.bodyHtml() + '</div>';
        html += '</section>';
        return html;
    }
}
