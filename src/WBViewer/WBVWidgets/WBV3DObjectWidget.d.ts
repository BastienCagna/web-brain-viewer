import * as THREE from 'three';
import WB3DView from "../WB3DView";
import WBVSectionWidget from "./WBVSectionWidget";
import { WBVWidget } from "./WBVWidget";
export default class WBV3DObjectWidget extends WBVSectionWidget {
    view: WB3DView;
    object: THREE.Mesh;
    constructor(parent?: WBVWidget | HTMLElement, view?: WB3DView, classnames?: string[] | string);
    setObject(obj: THREE.Mesh): void;
    bodyHtml(): string;
}
