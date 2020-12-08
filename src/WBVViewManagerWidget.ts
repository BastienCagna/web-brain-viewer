import { WBView } from "./WBView.js";
import WBVSectionWidget from "./WBVSectionWidget.js";

export default class WBVViewManagerWidget extends WBVSectionWidget {
    views: WBView[];

    constructor(parentId: string = null) {
        super(parentId, 'View Infos');
        this.views = [];
    }

    bodyHtml(): string {
        return "<p>To be implemented</p>";
    }

}