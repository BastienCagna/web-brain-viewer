import { WBView } from "./WBView.js";
import WBVSectionWidget from "./WBVSectionWidget.js";


class WBVViewListWidget extends WBVSectionWidget {
    views: WBView[];

    constructor(parentId: string = null) {
        super(parentId, 'Views');
        this.views = [];
    }

    addView(view: WBView): void {
        this.views.push(view);
        this.update();
    }

    getView(id: string): WBView {
        for(const view of this.views) {
            if(view.id.localeCompare(id)) return view;
        }
        return null;
    }

    bodyHtml(): string {
        let html = "<table><tr><th>Name</th><th>Type</th></tr>";
        for(const view of this.views) {
            html += '<tr id="' + view.id + '"><td>' + view.title + "</td><td>" + view.type + "</td></tr>";
        }
        html += '</table>';
        return html;
    }

    update() {
        super.update();
    }

}
export {WBVViewListWidget};