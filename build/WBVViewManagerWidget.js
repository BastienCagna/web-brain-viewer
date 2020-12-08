import WBVSectionWidget from "./WBVSectionWidget.js";
export default class WBVViewManagerWidget extends WBVSectionWidget {
    constructor(parentId = null) {
        super(parentId, 'View Infos');
        this.views = [];
    }
    bodyHtml() {
        return "<p>To be implemented</p>";
    }
}
//# sourceMappingURL=WBVViewManagerWidget.js.map