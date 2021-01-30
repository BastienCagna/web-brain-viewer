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
            'x: <input class="form-control-sm" type="number" size="1" value="' + cam.position.x + '"/> ' +
            'y: <input type="number" size="1" value="' + cam.position.y + '"/> ' +
            'z: <input type="number" size="1" value="' + cam.position.z + '"/> ' +
            '</td>';
        console.log(this.view.camera);
        html += "</tbody></table>";
        return html;
    }
}
//# sourceMappingURL=WBV3DCameraWidget.js.map