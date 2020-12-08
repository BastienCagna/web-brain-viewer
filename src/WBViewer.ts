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

    constructor(parentId) {
        super(parentId);

        this.name = 'Web Brain Viewer';

        // Create a bar that widgets
        this.toolbar = new WBVToolBar("wb_viewer_tb", "Viewer toolbar");
        // Add objects (or files) manager widget
        this.toolbar.widgets.push(new WBVObjectListWidget(this.toolbar.id));
        // Add view manager widget
        this.toolbar.widgets.push(new WBVViewListWidget(this.toolbar.id));
        // Add view manager widget
        this.toolbar.widgets.push(new WBVViewManagerWidget(this.toolbar.id));

        this.activeView = null;
        this.update();
    }

    html(): string {
        let html = "<div class='row wb-viewer' id='" + this.id + "'>";
        html += "<div class='col-md-3 wb-sidebar' id='" + this.toolbar.parentId + "'></div>";
        html += "<div class='col-md-9 wb-view' id='" + this.id + "_view'></div>";
        html += "</div>";
        return html;
    }

    update() {
        super.update();
        this.toolbar.update();

        if(!this.activeView) {
            this.activeView = new WB3DView( this.id + "_view", null, null, 600);
        }
    }
}