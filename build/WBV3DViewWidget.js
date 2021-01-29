import WBVViewWidget from "./WBVViewWidget.js";
export default class WBV3DViewWidget extends WBVViewWidget {
    constructor(view, objectWidget = null) {
        super(view, '3D View Infos');
        this.view = view;
        this.objectWidget = objectWidget;
        var that = this;
        $(document).on('click', '.wb-show-obj', function () {
            const oid = $(this).parent().parent().attr('target-data');
            const obj = that.view.scene.getObjectByName(oid);
            const visibility = $(this).is(':checked');
            if (obj.material)
                obj.material.visible = visibility;
            obj.children.forEach(function (o) { o.material.visible = visibility; });
            that.view.animate();
        });
        $(document).on('click', '.3dview-object-list * a.fa-wrench', function () {
            const oid = $(this).parent().parent().attr('target-data');
            that.objectWidget.setObject(that.view.scene.getObjectByName(oid));
        });
    }
    bodyHtml() {
        if (!this.view) {
            return '<p>No selected view.</p>';
        }
        else {
            let html = '<h4>' + this.view.title + '</h4>';
            html += '<table class="3dview-object-list"><tbody>';
            for (const obj of this.view.objects) {
                html += '<tr target-data="' + obj.name + '"><td>';
                html += '<input type="checkbox" id="' + obj.id + '_visible" class="wb-show-obj"';
                if (this.view.scene.getObjectById(obj.id))
                    html += 'checked="checked"';
                html += '></td><td><label for="' + obj.id + '_visible">' + obj.name + '</label></td>';
                if (this.objectWidget)
                    html += '<td><a role="button" class="fas fa-wrench"></a></td>';
                html += '</tr>';
            }
            html += '</tbody></table>';
            return html;
        }
    }
}
//# sourceMappingURL=WBV3DViewWidget.js.map