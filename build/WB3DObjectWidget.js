import * as THREE from "../dependencies/three.js/build/three.module.js";
import WBVSectionWidget from "./WBVSectionWidget.js";
export default class WBV3DObjectWidget extends WBVSectionWidget {
    constructor() {
        super(null, 'Object Details');
        this.object = null;
        var that = this;
        $(document).on('change', '#' + this.id + 'opa', function () {
            that.object.material.transparent = true;
            that.object.material.opacity = $(this).val();
        });
        $(document).on('change', '#' + this.id + 'color', function () {
            that.object.material.color = new THREE.Color($(this).val());
        });
    }
    setObject(obj) {
        this.object = obj;
        this.update();
    }
    bodyHtml() {
        if (!this.object) {
            return '<p>No selected object.</p>';
        }
        else {
            let html = '<table>';
            html += '<tr><th>Name</th><td>' + this.object.name + '</td></tr>';
            html += '<tr></tr><tr><th colspan=2><h4>Position</h4></th></tr>';
            html += '<tr><th>X</th><td>' + this.object.position.x + '</td></tr>';
            html += '<tr><th>Y</th><td>' + this.object.position.y + '</td></tr>';
            html += '<tr><th>Z</th><td>' + this.object.position.z + '</td></tr>';
            html += '<tr></tr><tr><th colspan=2>Material</th></tr>';
            if (this.object.material && this.object.material.opacity)
                html += '<tr><th>Opacity</th><td>' +
                    '<input type="range" class="form-control form-control-sm" id="' + this.id + 'opa" ' +
                    'size=1 min=0 max=1 step=0.05 value="' + this.object.material.opacity + '"/>' +
                    '</td></tr>';
            html += '<tr><th>Color</th><td>' +
                '<input type="color" class="form-control-sm" id="' + this.id + 'color" ' +
                'value="#' + this.object.material.color.getHexString() + '"/></td></tr>';
            return html;
        }
    }
}
//# sourceMappingURL=WB3DObjectWidget.js.map