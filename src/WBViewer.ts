import {WBVWidget} from "./WBVWidget.js";
import WBVToolBar from "./WBVToolBar.js";
import {WBVObjectListWidget} from './WBVObjectListWidget.js';
import {WBVViewListWidget} from './WBVViewListWidget.js';
import WB3DView from "./WB3DView.js";
import {WBView} from "./WBView.js";
import WBVViewManagerWidget from "./WBVViewManagerWidget.js";


export class WBViewer extends WBVWidget {
    toolbar: WBVToolBar = null;
    name: string = null;
    activeView: WBView;
    viewList: WBVViewListWidget;
    viewManager: WBVViewManagerWidget;

    constructor(parentId) {
        super(parentId);

        this.name = 'Web Brain Viewer';


        // Create a bar that widgets
        this.toolbar = new WBVToolBar("wb_viewer_tb", "Viewer toolbar");
        this.viewList = new WBVViewListWidget(this.toolbar.id)
        this.viewManager = new WBVViewManagerWidget(this.toolbar.id);
        // Add objects (or files) manager widget
        this.toolbar.widgets.push(new WBVObjectListWidget(this.toolbar.id));
        // Add view manager widget
        this.toolbar.widgets.push(this.viewList);
        // Add view manager widget
        this.toolbar.widgets.push(this.viewManager);

        this.activeView = null;
        this.update();
    }

    changeView(id: string) {
        this.activeView = this.viewList.getView(id);
        this.viewManager.setView(this.activeView);
    }

    html(): string {
        let html = "<div class='row wb-viewer' id='" + this.id + "'>";
        html += "<div class='col-md-3 wb-sidebar' id='" + this.toolbar.parentId + "'></div>";
        html += "<div class='col-md-9 wb-view' id='" + this.id + "_view'></div>";
        html += "</div>";
        return html;
    }

    update(): void {
        super.update();
        this.toolbar.update();

        if(!this.activeView) {
            if(this.viewList.views.length > 0) {
                this.changeView(this.viewList.views[0].id);
            }
            else {
                this.viewList.addView(new WB3DView( this.id + "_view", null, "Example view", null, 600));
                this.changeView(this.viewList.views[0].id);
            }
        }
    }
}