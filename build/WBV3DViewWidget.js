import WBVViewWidget from "./WBVViewWidget.js";
export default class WBV3DViewWidget extends WBVViewWidget {
    constructor(view, objectWidget = null) {
        super(view, '3D View Infos');
        this.view = view;
        this.objectWidget = objectWidget;
        var that = this;
        $(document).on('click', '.wb-show-obj', function () {
            const oid = $(this).parent().attr('target-data');
            const obj = that.view.scene.getObjectByName(oid);
            const visibility = $(this).is(':checked');
            if (obj.material)
                obj.material.visible = visibility;
            obj.children.forEach(function (o) { o.material.visible = visibility; });
            that.view.animate();
        });
        $(document).on('click', 'ul.dddview-object-list li a.link-button', function () {
            if (!$(this).attr("selected")) {
                const oid = $(this).parent().attr('target-data');
                that.objectWidget.setObject(that.view.scene.getObjectByName(oid));
                $('ul.dddview-object-list li a.link-button').each(function () {
                    $(this).removeAttr("selected");
                });
                $(this).attr("selected", "selected");
            }
            else {
                $(this).removeAttr("selected");
                that.objectWidget.setObject(null);
            }
        });
        $(document).on('click', 'ul.dddview-object-list li a.solo-button', function () {
            if (!$(this).hasClass("blink")) {
                const oid = $(this).parent().attr('target-data');
                if (!oid)
                    return;
                for (let obj of that.view.objects) {
                    obj.visible = obj.name === oid;
                }
                $('ul.dddview-object-list li a.blink').each(function () {
                    $(this).removeClass("blink");
                    $(this).removeAttr("selected");
                });
                $(this).addClass("blink");
                $(this).attr("selected", "selected");
                $(".wb-show-obj").each(function () {
                    $(this).attr("disabled", "disabled");
                });
            }
            else {
                $(this).removeClass("blink");
                $(this).removeAttr("selected");
                for (let obj of that.view.objects) {
                    obj.visible = $('#' + obj.id + '_visible').val();
                }
                $(".wb-show-obj").each(function () {
                    $(this).removeAttr("disabled");
                });
            }
        });
        $(document).on('click', 'ul.dddview-object-list li a.remove-button', function () {
            const oid = $(this).parent().attr('target-data');
            that.view.removeObjectByName(oid);
        });
    }
    bodyHtml() {
        if (!this.view) {
            return '<p>No selected view.</p>';
        }
        else {
            let html = '<h4>' + this.view.title + '</h4>';
            html += '<ul class="dddview-object-list">';
            for (const obj of this.view.objects) {
                html += '<li target-data="' + obj.name + '">';
                html += '<input type="checkbox" id="' + obj.id + '_visible" class="wb-show-obj"';
                if (this.view.scene.getObjectById(obj.id))
                    html += 'checked="checked"';
                html += '><a role="button" class="link-button">' + obj.name + '</a></>';
                if (this.objectWidget)
                    html += '<a role="button" class="fas fa-map-marker-alt control-button solo-button "></a>';
                if (obj.name.localeCompare("Origin") !== 0) {
                    html += '<a role="button" class="fas fa-trash control-button remove-button "></a>';
                }
                html += '</li>';
            }
            html += '</ul>';
            return html;
        }
    }
}
//# sourceMappingURL=WBV3DViewWidget.js.map