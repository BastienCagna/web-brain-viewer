import * as THREE from 'three'; //"https://unpkg.com/three@0.126.1/build/three.module";
import WBVViewWidget from "./WBVViewWidget";
import WB3DView from "../WB3DView";
import WBV3DObjectWidget from "./WBV3DObjectWidget";


/**
 * 3D View Widget (objects list, view parameters).
 */
export default class WBV3DViewWidget extends WBVViewWidget {
    view: WB3DView;
    objectWidget: WBV3DObjectWidget;

    /**
     *
     * @param view - Parent 3D view to which this widget is attached.
     */
    constructor(view: WB3DView, objectWidget: WBV3DObjectWidget = null, classnames : string[]|string = []) {
        super(view, '3D View Infos', classnames);
        this.view = view;
        this.objectWidget = objectWidget;

        // Events Management
        var that = this;
        // Visibility
        $(document).on('click', '.wb-show-obj', function() {
            const oid = $(this).parent().attr('target-data');
            const obj = <THREE.Mesh> that.view.scene.getObjectByName(oid);
            const visibility = $(this).is(':checked');
            if(obj.material instanceof THREE.Material) obj.material.visible = visibility;
            for(const o of obj.children) {
                if(o instanceof THREE.Mesh) o.material.visible = visibility;
            }
            that.view.animate();
        });
        //
        $(document).on('click', 'ul.dddview-object-list li a.link-button', function() {
            if(!$(this).attr("selected")) {
                const oid = $(this).parent().attr('target-data');
                that.objectWidget.setObject(<THREE.Mesh> that.view.scene.getObjectByName(oid));

                // Select this one and deselect others
                $('ul.dddview-object-list li a.link-button').each(function(){
                    $(this).removeAttr("selected");
                });
                $(this).attr("selected", "selected");
            }
            else {
                $(this).removeAttr("selected");
                that.objectWidget.setObject(null);
            }
        });
        // Solo
        $(document).on('click', 'ul.dddview-object-list li a.solo-button', function() {
            if(!$(this).hasClass("blink")) {
                const oid = $(this).parent().attr('target-data');
                if(!oid) return;
                that.view.solo(oid);
                // Select this one and deselect others
                $('ul.dddview-object-list li a.blink').each(function(){
                    $(this).removeClass("blink");
                    $(this).removeAttr("selected");
                });
                $(this).addClass("blink");
                $(this).attr("selected", "selected");
                $(".wb-show-obj").each(function() {
                    $(this).attr("disabled", "disabled"); });
            }
            else {
                $(this).removeClass("blink");
                $(this).removeAttr("selected");
                for(let obj of that.view.objects) {
                    obj.visible = $('#' + obj.id + '_visible').val();
                }
                $(".wb-show-obj").each(function() {
                    $(this).removeAttr("disabled"); });
            }
        });
        // Remove
        $(document).on('click', 'ul.dddview-object-list li a.remove-button', function() {
            const oid = $(this).parent().attr('target-data');
            that.view.removeObjectByName(oid);
        });
    }

    /**
     * Generate the table that list objects.
     */
    bodyHtml(): string {
        if(!this.view) {
            return '<p>No selected view.</p>';
        }
        else {
            let html = '<h4>' + this.view.title + '</h4>';
            html += '<ul class="dddview-object-list">';
            for(const obj of this.view.objects) {
                html += '<li target-data="' + obj.name + '">';
                html += '<input type="checkbox" id="' + obj.id + '_visible" class="wb-show-obj"';
                if(this.view.scene.getObjectById(obj.id))
                    html += 'checked="checked"';
                html += '><a role="button" class="link-button">' + obj.name + '</a></>';
                if(this.objectWidget)
                    html += '<a role="button" class="fas fa-map-marker-alt control-button solo-button "></a>';
                if(obj.name.localeCompare("Origin") !== 0) {
                    html += '<a role="button" class="fas fa-trash control-button remove-button "></a>';
                }
                html += '</li>';
            }
            html += '</ul>';
            return html;
        }
    }
}
