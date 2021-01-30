import * as THREE from "../dependencies/three.js/build/three.module.js";
import { BasicShadowMap } from "../dependencies/three.js/build/three.module.js";
import { TrackballControls } from '../dependencies/three.js/examples/jsm/controls/TrackballControls.js';
import { WBView } from './WBView.js';
import WBV3DViewWidget from "./WBV3DViewWidget.js";
import WBV3DObjectWidget from "./WB3DObjectWidget.js";
import WBVMetaDataWidget from "./WBVMetaDataWidget.js";
import WBV3DCameraWidget from "./WBV3DCameraWidget.js";
export default class WB3DView extends WBView {
    constructor(parentId, id = null, title = null, width = null, height = null) {
        super(parentId, id, width, height);
        this.mouse = new THREE.Vector2();
        this.objectWidget = new WBV3DObjectWidget();
        this.viewWidget = new WBV3DViewWidget(this, this.objectWidget);
        this.dataWidget = new WBVMetaDataWidget();
        this.cameraWidget = new WBV3DCameraWidget(this);
        this.toolbar.widgets.push(this.viewWidget);
        this.toolbar.widgets.push(this.objectWidget);
        this.toolbar.widgets.push(this.dataWidget);
        this.toolbar.widgets.push(this.cameraWidget);
        this.type = "3D";
        this.title = title;
        super.update();
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 1000);
        this.raycaster = new THREE.Raycaster();
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(this.width, this.height);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = BasicShadowMap;
        this.renderer.physicallyCorrectLights = true;
        this.viewElement().appendChild(this.renderer.domElement);
        this.camera.position.z = 200;
        this.camera.position.x = 200;
        this.camera.position.y = 200;
        this.camera.lookAt(0, 0, 0);
        this.controls = new TrackballControls(this.camera, this.renderer.domElement);
        this.controls.rotateSpeed = 2.0;
        this.scene.add(new THREE.AmbientLight(0xffffff, 0.7));
        const sun = new THREE.DirectionalLight(0xffffff, 0.5);
        const moon = new THREE.DirectionalLight(0xffffff, 0.25);
        sun.position.set(0, 0, 1000);
        moon.position.set(0, 0, -1000);
        this.scene.add(sun);
        this.scene.add(moon);
        const axesHelper = new THREE.AxesHelper(1000);
        axesHelper.name = "Origin";
        this.objects.push(axesHelper);
        this.scene.add(axesHelper);
        const animate = () => {
            requestAnimationFrame(animate);
            this.controls.update();
            this.renderer.render(this.scene, this.camera);
        };
        animate();
        this.animate = animate;
        this.renderer.domElement.addEventListener(`click`, (evt) => this.onClick(evt));
    }
    addObject(obj) {
        let obj3d = obj.toObject3D();
        obj3d = (!Array.isArray(obj3d)) ? [obj3d] : obj3d;
        for (const o of obj3d) {
            let allReadyExisting = false;
            for (let i = 0; i < this.objects.length; i++) {
                if (this.objects[i].name.localeCompare(o.name) === 0) {
                    this.objects[i] = o;
                    allReadyExisting = true;
                    break;
                }
            }
            if (!allReadyExisting) {
                this.objects.push(o);
                this.scene.add(o);
            }
        }
        this.viewWidget.update();
        this.objectWidget.update();
    }
    removeObjectByName(name) {
        for (let i = 0; i < this.objects.length; i++) {
            if (this.objects[i].name.localeCompare(name) === 0) {
                this.objects.splice(i, 1);
                break;
            }
        }
        this.scene.remove(this.scene.getObjectByName(name));
        this.animate();
        this.viewWidget.update();
        this.objectWidget.update();
    }
    onClick(event) {
        event.preventDefault();
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.scene.children);
        if (intersects.length > 0) {
            const object = intersects[0].object;
            this.objectWidget.setObject(object);
            if (object instanceof THREE.Mesh && Object.keys(object.userData).length > 0) {
                this.dataWidget.data = object.userData;
            }
            else {
                this.dataWidget.data = null;
            }
        }
        else {
            this.dataWidget.data = null;
        }
    }
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}
//# sourceMappingURL=WB3DView.js.map