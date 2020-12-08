import WBVSectionWidget from "./WBVSectionWidget.js";
class WBVViewListWidget extends WBVSectionWidget {
    constructor(parentId = null) {
        super(parentId, 'Views');
        this.viewManagers = [];
    }
    addView(WBView) {
        console.log("I gonna add a new view");
    }
    bodyHtml() {
        let html = "<table><tr><th>Name</th><th>Type</th></tr>";
        for (const manager of this.viewManagers) {
            html += "<tr><td>" + manager.id + "</td><td></td></tr>";
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