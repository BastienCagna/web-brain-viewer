import WBVViewWidget from "./WBVViewWidget.js";
export default class WBV3DViewWidget extends WBVViewWidget {
    constructor(view) {
        super(view, '3D View Infos');
        this.view = view;
        var that = this;
        $(document).on('click', '.wb-show-obj', function () {
            const obj = that.view.scene.getObjectByName($(this).attr('target-data'));
            obj.material.visible = $(this).is(':checked');
            that.view.animate();
        });
    }
    bodyHtml() {
        if (!this.view) {
            return '<p>No selected view.</p>';
        }
        else {
            let html = '<h4>' + this.view.title + '</h4>';
            html += '<table><tbody>';
            for (const obj of this.view.objects) {
                html += '<tr><td>';
                html += '<input type="checkbox" id="' + obj.id + '_visible" class="wb-show-obj" target-data="' + obj.name + '"';
                if (this.view.scene.getObjectById(obj.id))
                    html += 'checked="checked"';
                html += '></td><td><label for="' + obj.id + '_visible">' + obj.name + '</label></td>';
                html += '<td><a role="button" class="fas fa-wrench" target-data="' + obj.id + '"></a></td>';
                html += '</tr>';
            }
            html += '</tbody></table>';
            return html;
        }
    }
}
//# sourceMappingURL=WBV3DViewWidget.js.map