import WB3DView from "../WB3DView";
import WBVSectionWidget from "./WBVSectionWidget";


/**
 * 3D View Widget (objects list, view parameters).
 */
export default class WBV3DCameraWidget extends WBVSectionWidget {
    view: WB3DView;

    /**
     *
     * @param view - Parent 3D view to which this widget is attached.
     */
    constructor(view: WB3DView, classnames: string[]|string = []) {
        super(view, 'Camera', classnames);
        this.view = view;
    }

    /**
     * Generate the table that list objects.
     */
    bodyHtml(): string {
        const cam = this.view.camera;
        let html = '<table><tbody>';
        html += '<tr><th>Position</th><td>' +
            'x: <input id="' + this.id + '_posx" type="number" size="1" value="' + cam.position.x + '"/> ' +
            'y: <input id="' + this.id + '_posy" type="number" size="1" value="' + cam.position.y + '"/> ' +
            'z: <input id="' + this.id + '_posz" type="number" size="1" value="' + cam.position.z + '"/> ' +
            '</td>'
        html += "</tbody></table>";
        return html;
    }

    onCameraChange(): void {
        if(this.view) {
            const cam = this.view.camera;
            console.log("nex position:", cam.position);
            $('#' + this.id + '_posx').val(cam.position.x);
            $('#' + this.id + '_posy').val(cam.position.y);
            $('#' + this.id + '_posz').val(cam.position.z);
        }
    }
}
