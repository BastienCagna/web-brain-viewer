import WBVSectionWidget from "./WBVSectionWidget";
export default class WBVViewWidget extends WBVSectionWidget {
    constructor(view, title = 'View Infos', classnames = []) {
        super(view.toolbar, title, classnames);
        this.view = view;
    }
    bodyHtml() {
        if (!this.view) {
            return '<p>No selected view.</p>';
        }
        else {
            let html = '<h4>' + this.view.title + '</h4>';
            return html;
        }
    }
    setView(view) {
        this.view = view;
        this.update();
    }
}
//# sourceMappingURL=WBVViewWidget.js.map