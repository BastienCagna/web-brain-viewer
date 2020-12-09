import { WBVWidget } from "./WBVWidget.js";
import WBVToolBar from "./WBVToolBar.js";
import { WBVObjectListWidget } from './WBVObjectListWidget.js';
import { WBVViewListWidget } from './WBVViewListWidget.js';
import WB3DView from "./WB3DView.js";
import WBVViewManagerWidget from "./WBVViewManagerWidget.js";
export class WBViewer extends WBVWidget {
    constructor(parentId) {
        super(parentId);
        this.toolbar = null;
        this.name = null;
        this.name = 'Web Brain Viewer';
        this.toolbar = new WBVToolBar("wb_viewer_tb", "Viewer toolbar");
        this.viewList = new WBVViewListWidget(this.toolbar.id);
        this.viewManager = new WBVViewManagerWidget(this.toolbar.id);
        this.toolbar.widgets.push(new WBVObjectListWidget(this.toolbar.id));
        this.toolbar.widgets.push(this.viewList);
        this.toolbar.widgets.push(this.viewManager);
        this.activeView = null;
        this.update();
    }
    changeView(id) {
        this.activeView = this.viewList.getView(id);
        this.viewManager.setView(this.activeView);
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
        if (!this.activeView) {
            if (this.viewList.views.length > 0) {
                this.changeView(this.viewList.views[0].id);
            }
            else {
                this.viewList.addView(new WB3DView(this.id + "_view", null, "Example view", null, 600));
                this.changeView(this.viewList.views[0].id);
            }
        }
    }
}
//# sourceMappingURL=WBViewer.js.map