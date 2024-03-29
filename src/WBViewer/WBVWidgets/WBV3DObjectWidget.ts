import * as THREE from 'three'; //"https://unpkg.com/three@0.126.1/build/three.module";
import WB3DView from "../WB3DView";
import WBVSectionWidget from "./WBVSectionWidget";
import {WBVWidget} from "./WBVWidget";
import {Object3D} from "three";


function positionInput(id: string, position: THREE.Vector3 = null ): string {
    if(!position) position = new THREE.Vector3();
    return '<fieldset class="vector-form-control">x: <input id="' + id + '_posx" type="number" size="1" value="' + position.x + '"/> ' +
        'y: <input id="' + id + '_posy" type="number" size="1" value="' + position.y + '"/> ' +
        'z: <input id="' + id + '_posz" type="number" size="1" value="' + position.z + '"/> ' +
        '</td>';
}

export default class WBV3DObjectWidget extends WBVSectionWidget {
    view: WB3DView;
    object: THREE.Mesh;

    constructor(parent: WBVWidget|HTMLElement = null, view: WB3DView = null, classnames : string[]|string = []) {
        super(parent, 'Object Details', classnames);
        this.view = view;
        this.object = null;

        // TODO: move work to methods
        var that = this;
        const mat = this.object ? <THREE.MeshLambertMaterial> this.object.material : new THREE.MeshLambertMaterial();
        $(document).on('change', '#' + this.id + 'opa', function () {
            mat.transparent = true;
            mat.opacity = Number($(this).val());
        });
        $(document).on('change', '#' + this.id + 'color', function () {
            mat.color = new THREE.Color(String($(this).val()));
        });
        $(document).on('click', '.new_plan', function() {
            if(!mat.clippingPlanes)
                mat.clippingPlanes = [];
            mat.clippingPlanes.push(
                new THREE.Plane( new THREE.Vector3( 1, 0, 0 ), 0 ));
            that.update();
        });
        $(document).on('change', '.control-plane-axis', function() {
            const plane = mat.clippingPlanes[$(this).parent().attr("target-data")];
            let normal;
            switch ($(this).val()) {
                case 'x': normal = new THREE.Vector3(-1, 0, 0); break;
                case 'y': normal = new THREE.Vector3(0, 1, 0); break;
                case 'z':
                default:  normal = new THREE.Vector3(0, 0, 1); break;
            }
            plane.normal = normal;
        });
        $(document).on('change', '.control-plane-constant', function() {
            const plane = mat.clippingPlanes[$(this).parent().attr("target-data")];
            plane.constant = $(this).val();
        });
        $(document).on('click', '.control-plane-reverse', function() {
            const plane = mat.clippingPlanes[$(this).parent().attr("target-data")];
            plane.normal = plane.normal.multiplyScalar(-1);
        });
        $(document).on('click', '.control-plane-remove', function() {
            delete mat.clippingPlanes[$(this).parent().attr("target-data")];
        });
    }

    setObject(obj: THREE.Mesh): void {
        this.object = obj;
        this.update();
    }

    bodyHtml(): string {
        if(!this.object) {
            return '<p>No selected object.</p>';
        }
        else {
            const mat = <THREE.MeshLambertMaterial> this.object.material;
            let html = '<table>';
            html += '<tr><th>Name</th><td>' + this.object.name + '</td></tr>';

            html += '<tr></tr><tr><th>Position</th>' +
                '<td>' + positionInput(this.id, this.object.position) + '</td></tr>';

            html += '<tr></tr><tr><th colspan=2>Material</th></tr>'
            if(this.object.material && mat.opacity)
                html += '<tr><th>Opacity</th><td>' +
                    '<input type="range" class="form-control form-control-sm" id="' + this.id + 'opa" ' +
                    'size=1 min=0 max=1 step=0.05 value="' + mat.opacity + '"/>' +
                    '</td></tr>';

            html += '<tr><th>Color</th><td>' +
                '<input type="color" class="form-control-sm" id="' + this.id + 'color" ' +
                'value="#' + mat.color.getHexString() + '"/></td></tr>';

            html += '<tr></tr><tr><th colspan=2>Clippings plans</th></tr>';
            if(mat.clippingPlanes) {
                for(let p = 0; p < mat.clippingPlanes.length; p++) {
                    const plane = mat.clippingPlanes[p];
                    html += '<tr><th>Plane ' + (p+1) + '</th><td target-data="' + p + '">' +
                        '<select size=1 id="' + this.id + '_axis" class="form-control control-plane-axis vector-form-control">';
                    for(const ax of ["x", "y", "z"]) {
                        html += '<option value="' + ax + '"';
                        if(plane.normal[ax] === 1) html += ' selected="selected"';
                        html += '>' + ax + '</option>';
                    }
                    html += '</select>';
                    html += '<input class="from-control control-plane-constant" type="range" min=-50 max=50 value="' + plane.constant + '"/>' +
                        '<a role="button" class="fas fa-exchange-alt control-plane-reverse" />' +
                        '<a role="button" class="fas fa-eye control-button show-plane-helper"></a>' +
                        '<a role="button" class="fas fa-trash control-button control-plane-remove"></a>' +
                        '</td></tr>';
                }
            }
            html += '<tr><td colspan=2><button class="new_plan" target-data="' + this.object.name + '">Add a new plan</button></td></tr>';

            html += '</table>';
            return html;
        }
    }
}
