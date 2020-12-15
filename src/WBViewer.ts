import {WBVWidget} from "./WBVWidget.js";
import WBVToolBar from "./WBVToolBar.js";
import {WBVObjectListWidget} from './WBVObjectListWidget.js';
import {WBVViewListWidget} from './WBVViewListWidget.js';
import WB3DView from "./WB3DView.js";
import {WBView} from "./WBView.js";
import WBVViewWidget from "./WBVViewWidget.js";
import WBVCreditWidget from "./WBVCreditWidget.js";


export class WBViewer extends WBVWidget {
    viewerToolbar: WBVToolBar = null;
    viewToolbar: WBVToolBar = null;
    name: string = null;
    activeView: WBView;
    objectList: WBVObjectListWidget;
    viewList: WBVViewListWidget;

    constructor(parentId) {
        super(parentId);

        this.name = 'Web Brain Viewer';

        // Create a bar that widgets
        this.viewerToolbar = new WBVToolBar("wb_viewer_tb", "Viewer toolbar");
        this.viewList = new WBVViewListWidget(this.viewerToolbar.id)
        this.objectList = new WBVObjectListWidget(this.viewerToolbar.id);
        // Add objects (or files) manager widget
        this.viewerToolbar.widgets.push(this.objectList);
        // Add view manager widget
        this.viewerToolbar.widgets.push(this.viewList);
        this.viewerToolbar.widgets.push(new WBVCreditWidget(this.viewerToolbar.id));

        // View tool bar
        this.viewToolbar = new WBVToolBar("wb_view_tb", "View toolbar");

        this.activeView = null;

        this.update();

        const that = this;
        $(document).on('click', '#wbv_add_to_view', function() {
            for(const obj of that.objectList.selectedObjects()) {
                that.activeView.addObject(obj);
            }
        });
    }

    changeView(id: string) {
        this.activeView = this.viewList.getView(id);
        /*for(const w of this.viewToolbar.widgets) {
            w.parentId = null;
        }*/
        this.viewToolbar.widgets = this.activeView.toolbar.widgets;
        for(const w of this.viewToolbar.widgets) {
            w.parentId = this.viewToolbar.id;
        }
        this.viewToolbar.update();
    }

    html(): string {
        let html = '<div class="wb-viewer" id="' + this.id + '">';

        html += '<section class="wb-sidebar" style="left:0px">';
        html += '<header target-data="left_sidebar"><h2>Inputs</h2></header><div id="left_sidebar">';
        html += '<div class="wbv-tb" id="' + this.viewerToolbar.parentId + '"></div>';
        html += '</div></section>';

        html += '<section class="wb-sidebar" style="right:0px">';
        html += '<div id="right_sidebar"><div class="wbv-tb" id="' + this.viewToolbar.parentId + '"></div></div>';
        html += '<header target-data="right_sidebar"><h2>Current View</h2></header>';
        html += '</section>';

        html += '<div class="wb-view" id="' + this.id + '_view"></div>';
        return html;
    }

    update(): void {
        super.update();
        this.viewerToolbar.update();
        this.viewToolbar.update();

        if(!this.activeView) {
            if(this.viewList.views.length > 0) {
                this.changeView(this.viewList.views[0].id);
            }
            else {
                this.viewList.addView(new WB3DView( this.id, this.id + '_view', "Example view", null, 600));
                this.changeView(this.viewList.views[0].id);
            }
        }
    }
}

$(document).on('click', '.wb-sidebar header', function() {
    $('#' + $(this).attr('target-data')).toggle('fast');
});
