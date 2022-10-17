import * as THREE from 'three';
import WBVSectionWidget from "./WBVSectionWidget";
import { WBVWidget } from "./WBVWidget";
export default class WBVThreeMeshWidget extends WBVSectionWidget {
    mesh: THREE.Mesh;
    constructor(parent: WBVWidget, mesh: THREE.Mesh);
    bodyHtml(): string;
}
