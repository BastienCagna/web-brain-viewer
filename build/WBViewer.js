import { WBVWidget } from "./WBVWidget.js";
import WBVToolBar from "./WBVToolBar.js";
import { WBVObjectListWidget } from './WBVObjectListWidget.js';
import { WBVViewListWidget } from './WBVViewListWidget.js';
import WB3DView from "./WB3DView.js";
export class WBViewer extends WBVWidget {
    constructor(parentId) {
        super(parentId);
        this.toolbar = null;
        this.name = null;
        this.name = 'Web Brain Viewer';
        this.toolbar = new WBVToolBar("wb_viewer_tb", "Viewer toolbar");
        this.viewList = new WBVViewListWidget(this.toolbar.id);
        this.objectList = new WBVObjectListWidget(this.toolbar.id);
        this.toolbar.widgets.push(this.objectList);
        this.toolbar.widgets.push(this.viewList);
        this.activeView = null;
        this.update();
        const that = this;
        $(document).on('click', '#wbv_add_to_view', function () {
            for (const obj of that.objectList.selectedObjects()) {
                that.activeView.addObject(obj);
            }
        });
    }
    changeView(id) {
        this.activeView = this.viewList.getView(id);
    }
    html() {
        let html = "<div class='wb-viewer' id='" + this.id + "'>";
        html += "<div class='wb-sidebar' id='" + this.toolbar.parentId + "'></div>";
        html += "<div class='wb-view' id='" + this.id + "_view'></div>";
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
                this.viewList.addView(new WB3DView(null, this.id + '_view', "Example view", null, 800));
                this.changeView(this.viewList.views[0].id);
            }
        }
    }
}
//# sourceMappingURL=WBViewer.js.map