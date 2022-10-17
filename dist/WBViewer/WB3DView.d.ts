import * as THREE from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass';
import { WBView } from './WBView';
import { WBObject } from "../WBObjects/WBObject";
import WBV3DViewWidget from "./WBVWidgets/WBV3DViewWidget";
import WBV3DObjectWidget from "./WBVWidgets/WBV3DObjectWidget";
import WBVMetaDataWidget from "./WBVWidgets/WBVMetaDataWidget";
import WBV3DCameraWidget from "./WBVWidgets/WBV3DCameraWidget";
import { WBVWidget } from "./WBVWidgets/WBVWidget";
export default class WB3DView extends WBView {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    controls: TrackballControls | OrbitControls;
    raycaster: THREE.Raycaster;
    mouse: THREE.Vector2;
    viewWidget: WBV3DViewWidget;
    objectWidget: WBV3DObjectWidget;
    dataWidget: WBVMetaDataWidget;
    cameraWidget: WBV3DCameraWidget;
    grid: THREE.PolarGridHelper;
    origin: THREE.AxesHelper;
    lastStaticCamPosition: THREE.Vector3;
    camRotationSpeed: number;
    angle: number;
    animate: any;
    composer: EffectComposer;
    outlinePass: OutlinePass;
    onClickCallBack: any;
    onFrameCallBack: any;
    constructor(parent: WBVWidget | HTMLElement, title?: any, width?: number, height?: number);
    addObject(obj: WBObject | THREE.Object3D | THREE.Object3D[] | THREE.Group | THREE.Group[]): void;
    removeObjectByName(name: string): void;
    getObjectsByName(name: string, limit?: number): THREE.Mesh[];
    allObjects(): THREE.Mesh[];
    solo(name?: any): void;
    onWindowResize(): void;
    onClick(event: any): void;
    onKeyDown(event: any): void;
    rotate(on: boolean, speed?: number): void;
}
