import * as THREE from "../dependencies/three.js/build/three.module.js";
import WBVSectionWidget from "./WBVSectionWidget";

export default class WBVThreeMeshWidget extends WBVSectionWidget {
    mesh: THREE.Mesh;

    constructor(parentId:string = null, mesh: THREE.Mesh) {
        super(parentId, "Mesh options");
        this.mesh = mesh;
    }

    bodyHtml(): string {
        let html = "<p><b>Name:</b> " + this.mesh.name + ""
        return "";
    }
}