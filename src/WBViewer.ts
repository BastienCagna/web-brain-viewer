import {WBVWidget} from "./WBVWidget.js";
import WBVToolBar from "./WBVToolBar.js";
import {WBVObjectListWidget} from './WBVObjectListWidget.js';
import {WBVViewListWidget} from './WBVViewListWidget.js';
import WB3DView from "./WB3DView.js";
import {WBView} from "./WBView.js";
import WBVCreditWidget from "./WBVCreditWidget.js";

/**
 * Viewer object that will contain view and toolbars.
 */
export class WBViewer extends WBVWidget {
    viewerToolbar: WBVToolBar;
    viewToolbar: WBVToolBar;
    name: string = null;
    activeView: WBView;
    objectList: WBVObjectListWidget;
    viewList: WBVViewListWidget;

    /**
     * Create the viewer: create toolbars, set the default view and render the HTML element.
     * @param parentId - ID of the parent HTML element
     */
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
    }

    /**
     * Switch current view to an other
     * @param id - View Id
     */
    changeView(id: string) {
        this.activeView = this.viewList.getView(id);
        this.objectList.targetView = this.activeView;
        /*for(const w of this.viewToolbar.widgets) {
            w.parentId = null;
        }*/
        this.viewToolbar.widgets = this.activeView.toolbar.widgets;
        for(const w of this.viewToolbar.widgets) {
            w.parentId = this.viewToolbar.id;
        }
        this.viewToolbar.update();
    }

    /**
     * Generate two sidebars and the central division that view contain the current view.
     */
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

    /**
     * Update the viewer and view toolbars and set the default view if not view is currently set.
     */
    update(): void {
        super.update();
        this.viewerToolbar.update();
        this.viewToolbar.update();

        if(!this.activeView) {
            if(this.viewList.views.length > 0) {
                this.changeView(this.viewList.views[0].id);
            }
            else {
                this.viewList.addView(
                    new WB3DView( this.id, this.id + '_view', "Example view", null, null));
                this.changeView(this.viewList.views[0].id);
            }
        }
    }
}

// Display/Hide toolbar on header click
$(document).on('click', '.wb-sidebar header', function() {
    $('#' + $(this).attr('target-data')).toggle('fast');
});
