import * as THREE from "../dependencies/three.js/build/three.module.js";
import WB3DView from "./WB3DView.js";
import WBVSectionWidget from "./WBVSectionWidget.js";


export default class WBV3DObjectWidget extends WBVSectionWidget {
    object: THREE.Object3D;

    constructor(obj: THREE.Object3D = null) {
        super('Object infos');
        this.object = obj;
    }

    bodyHtml(): string {
        if(!this.object) {
            return '<p>No selected object.</p>';
        }
        else {
            return '<p>' + this.object.name+ '</p>';
        }
    }

}
