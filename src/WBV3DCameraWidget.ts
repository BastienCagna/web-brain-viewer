import { WBView } from "./WBView.js";
import WBVViewWidget from "./WBVViewWidget.js";
import WB3DView from "./WB3DView.js";
import WBVSectionWidget from "./WBVSectionWidget.js";


/**
 * 3D View Widget (objects list, view parameters).
 */
export default class WBV3DCameraWidget extends WBVSectionWidget {
    view: WB3DView;

    /**
     *
     * @param view - Parent 3D view to which this widget is attached.
     */
    constructor(view: WB3DView) {
        super(view.toolbar.id, 'Camera');
        this.view = view;
    }

    /**
     * Generate the table that list objects.
     */
    bodyHtml(): string {
        const cam = this.view.camera;
        let html = '<table><tbody>';
        html += '<tr><th>Position</th><td>' +
            'x: <input class="form-control-sm" type="number" size="1" value="' + cam.position.x + '"/> ' +
            'y: <input type="number" size="1" value="' + cam.position.y + '"/> ' +
            'z: <input type="number" size="1" value="' + cam.position.z + '"/> ' +
            '</td>'
        console.log(this.view.camera);

        html += "</tbody></table>";
        return html;
    }
}
