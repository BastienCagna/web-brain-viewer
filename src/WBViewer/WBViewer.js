import { WBVWidget } from "./WBVWidgets/WBVWidget";
import WBVToolBar from "./WBVWidgets/WBVToolBar";
import { WBVObjectListWidget } from './WBVWidgets/WBVObjectListWidget';
import WB3DView from "./WB3DView";
import WBVCreditWidget from "./WBVWidgets/WBVCreditWidget";
export class WBViewer extends WBVWidget {
    constructor(parent, name = 'Web Brain Viewer', classnames = []) {
        super(parent, classnames);
        this.name = null;
        this.classnames.push("wb-viewer-instance");
        this.name = name;
        this.viewerToolbar = new WBVToolBar(this, "Viewer toolbar");
        this.objectList = new WBVObjectListWidget(this.viewerToolbar);
        this.viewerToolbar.widgets.push(this.objectList);
        this.viewerToolbar.widgets.push(new WBVCreditWidget(this.viewerToolbar));
        this.viewToolbar = new WBVToolBar(this, "View toolbar");
        this.activeView = new WB3DView(this, "Example view", null, null);
        this.objectList.targetView = this.activeView;
        this.viewToolbar.widgets = this.activeView.toolbar.widgets;
        for (const w of this.viewToolbar.widgets) {
            w.parent = this.viewToolbar;
        }
        this.viewToolbar.update();
    }
    changeView(id) {
        this.activeView = this.viewList.getView(id);
        this.objectList.targetView = this.activeView;
        this.viewToolbar.widgets = this.activeView.toolbar.widgets;
        for (const w of this.viewToolbar.widgets) {
            w.parent = this.viewToolbar;
        }
        this.viewToolbar.update();
    }
    innerHTML() {
        let html = '<section class="wb-sidebar" style="left:0px">';
        html += '<header target-data="left_sidebar"><h2>Inputs</h2></header><div id="left_sidebar">';
        html += '<div class="wbv-tb" id="' + this.viewerToolbar.id + '"></div>';
        html += '</div></section>';
        html += '<section class="wb-sidebar" style="right:0px">';
        html += '<div id="right_sidebar"><div class="wbv-tb" id="' + this.viewToolbar.id + '"></div></div>';
        html += '<header target-data="right_sidebar"><h2>Current View</h2></header>';
        html += '</section>';
        if (this.activeView)
            html += '<div class="wb-view" id="' + this.activeView.id + '"></div>';
        return html;
    }
    update() {
        super.update();
        this.viewerToolbar.update();
        this.viewToolbar.update();
    }
}
$(document).on('click', '.wb-sidebar header', function () {
    $('#' + $(this).attr('target-data')).toggle('fast');
});
//# sourceMappingURL=WBViewer.js.map