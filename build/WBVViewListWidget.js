import WBVSectionWidget from "./WBVSectionWidget.js";
class WBVViewListWidget extends WBVSectionWidget {
    constructor(parentId = null) {
        super(parentId, 'Views');
        this.views = [];
    }
    addView(view) {
        this.views.push(view);
        this.update();
    }
    getView(id) {
        for (const view of this.views) {
            if (view.id.localeCompare(id))
                return view;
        }
        return null;
    }
    bodyHtml() {
        let html = "<table><tr><th>Name</th><th>Type</th></tr>";
        for (const view of this.views) {
            html += '<tr id="' + view.id + '"><td>' + view.title + "</td><td>" + view.type + "</td></tr>";
        }
        html += '</table>';
        return html;
    }
    update() {
        super.update();
    }
}
export { WBVViewListWidget };
//# sourceMappingURL=WBVViewListWidget.js.map