import { WBView } from "./WBView.js";
import WBVSectionWidget from "./WBVSectionWidget.js";
import WBVViewManagerWidget from "./WBVViewManagerWidget.js";

class WBVViewListWidget extends WBVSectionWidget {
    viewManagers: WBVViewManagerWidget[];

    constructor(parentId: string = null) {
        super(parentId, 'Views');
        this.viewManagers = [];
    }

    addView(WBView): void {
        console.log("I gonna add a new view");
    }

    bodyHtml(): string {
        let html = "<table><tr><th>Name</th><th>Type</th></tr>";
        for(const manager of this.viewManagers) {
            html += "<tr><td>" + manager.id + "</td><td></td></tr>";
        }
        html += '</table>';
        return html;
    }

    update() {
        super.update();
    }

}
export {WBVViewListWidget};