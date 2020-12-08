import { WBVWidget } from "./WBVWidget.js";
import WBVToolBar from "./WBVToolBar.js";
import { WBVObjectListWidget } from './WBVObjectListWidget.js';
import { WBVViewListWidget } from './WBVViewListWidget.js';
import WBVViewManagerWidget from "./WBVViewManagerWidget.js";
export class WBViewer extends WBVWidget {
    constructor(parentId) {
        super(parentId);
        this.toolbar = null;
        this.name = null;
        this.name = 'Web Brain Viewer';
        this.toolbar = new WBVToolBar("wb_viewer_tb", "Viewer toolbar");
        this.toolbar.widgets.push(new WBVObjectListWidget(this.toolbar.id));
        this.toolbar.widgets.push(new WBVViewListWidget(this.toolbar.id));
        this.toolbar.widgets.push(new WBVViewManagerWidget(this.toolbar.id));
        this.update();
    }
    html() {
        let html = "<div class='row wb-viewer' id='" + this.id + "'>";
        html += "<div class='col-md-3 wb-sidebar' id='" + this.toolbar.parentId + "'></div>";
        html += "<div class='col-md-9 wb-view' id='" + this.id + "_view'></div>";
        html += "</div>";
        return html;
    }
    update() {
        super.update();
        this.toolbar.update();
    }
}
//# sourceMappingURL=WBViewer.js.map