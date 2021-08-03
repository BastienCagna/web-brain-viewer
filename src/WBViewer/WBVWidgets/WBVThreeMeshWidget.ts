import * as THREE from 'three'; //"https://unpkg.com/three@0.126.1/build/three.module";
import WBVSectionWidget from "./WBVSectionWidget";
import {WBVWidget} from "./WBVWidget";


export default class WBVThreeMeshWidget extends WBVSectionWidget {
    mesh: THREE.Mesh;

    constructor(parent: WBVWidget = null, mesh: THREE.Mesh) {
        super(parent, "Mesh options");
        this.mesh = mesh;
    }

    bodyHtml(): string {
        let html = "<p><b>Name:</b> " + this.mesh.name + ""
        return html;
    }
}
