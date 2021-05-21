import { WBView } from "../WBView.js";
import WBVSectionWidget from "./WBVSectionWidget.js";
import {WBVWidget} from "./WBVWidget.js";


class WBVViewListWidget extends WBVSectionWidget {
    views: WBView[];

    constructor(parent: WBVWidget = null) {
        super(parent, 'Views');
        this.views = [];
    }

    addView(view: WBView): void {
        this.views.push(view);
        this.update();
    }

    getView(id: string): WBView {
        for(const view of this.views) {
            if(view.id.localeCompare(id)===0) return view;
        }
        return null;
    }

    bodyHtml(): string {
        let html = "<table><tr><th>Name</th><th>Type</th></tr>";
        for(const view of this.views) {
            html += '<tr id="' + view.id + '"><td>' + view.title + "</td><td>" + view.type + "</td></tr>";
        }
        html += '</table>';
        html += '<input type="button" class="button" id="wbv_add_view" value="New 2D view">';
        html += '<input type="button" class="button" id="wbv_add_view" value="New 3D view">';
        return html;
    }

    update() {
        super.update();
    }

}
export {WBVViewListWidget};
