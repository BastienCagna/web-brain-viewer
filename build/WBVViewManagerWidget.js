import WBVSectionWidget from "./WBVSectionWidget.js";
export default class WBVViewManagerWidget extends WBVSectionWidget {
    constructor(parentId = null) {
        super(parentId, 'View Infos');
    }
    bodyHtml() {
        if (!this.view) {
            return '<p>No selected view.</p>';
        }
        else {
            return '<h4>' + this.view.title + '</h4>';
        }
    }
    setView(view) {
        this.view = view;
        this.update();
    }
}
//# sourceMappingURL=WBVViewManagerWidget.js.map