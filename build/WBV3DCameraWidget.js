import WBVSectionWidget from "./WBVSectionWidget.js";
export default class WBV3DCameraWidget extends WBVSectionWidget {
    constructor(view) {
        super(view.toolbar.id, 'Camera');
        this.view = view;
    }
    bodyHtml() {
        const cam = this.view.camera;
        let html = '<table><tbody>';
        html += '<tr><th>Position</th><td>' +
            'x: <input id="' + this.id + '_posx" type="number" size="1" value="' + cam.position.x + '"/> ' +
            'y: <input id="' + this.id + '_posy" type="number" size="1" value="' + cam.position.y + '"/> ' +
            'z: <input id="' + this.id + '_posz" type="number" size="1" value="' + cam.position.z + '"/> ' +
            '</td>';
        html += "</tbody></table>";
        return html;
    }
    onCameraChange() {
        if (this.view) {
            const cam = this.view.camera;
            console.log("nex position:", cam.position);
            $('#' + this.id + '_posx').val(cam.position.x);
            $('#' + this.id + '_posy').val(cam.position.y);
            $('#' + this.id + '_posz').val(cam.position.z);
        }
    }
}
//# sourceMappingURL=WBV3DCameraWidget.js.map