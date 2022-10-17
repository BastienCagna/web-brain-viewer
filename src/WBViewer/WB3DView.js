import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader';
import { WBView } from './WBView';
import { WBObject } from "../WBObjects/WBObject";
import WBV3DViewWidget from "./WBVWidgets/WBV3DViewWidget";
import WBV3DObjectWidget from "./WBVWidgets/WBV3DObjectWidget";
import WBVMetaDataWidget from "./WBVWidgets/WBVMetaDataWidget";
import WBV3DCameraWidget from "./WBVWidgets/WBV3DCameraWidget";
import { WBVWidget } from "./WBVWidgets/WBVWidget";
import WBVToolBar from "./WBVWidgets/WBVToolBar";
export default class WB3DView extends WBView {
    constructor(parent, title = null, width = null, height = null) {
        super(parent, width, height);
        this.mouse = new THREE.Vector2();
        this.camRotationSpeed = 0.;
        this.angle = 0.;
        this.onClickCallBack = null;
        this.onFrameCallBack = null;
        this.objectWidget = new WBV3DObjectWidget(null);
        this.viewWidget = new WBV3DViewWidget(this, this.objectWidget);
        this.dataWidget = new WBVMetaDataWidget(null);
        this.cameraWidget = new WBV3DCameraWidget(this);
        this.toolbar = new WBVToolBar(null);
        this.toolbar.widgets.push(this.viewWidget);
        this.toolbar.widgets.push(this.objectWidget);
        this.toolbar.widgets.push(this.dataWidget);
        this.toolbar.widgets.push(this.cameraWidget);
        this.type = "3D";
        this.title = title;
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x48494a);
        this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 1000);
        this.raycaster = new THREE.Raycaster();
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(this.width, this.height);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.BasicShadowMap;
        this.renderer.physicallyCorrectLights = true;
        this.renderer.localClippingEnabled = true;
        if (this.parent instanceof WBVWidget)
            this.parent.update();
        this.update();
        this.viewElement().appendChild(this.renderer.domElement);
        this.camera.position.x = 120;
        this.camera.position.y = 40;
        this.camera.position.z = 0;
        this.camera.lookAt(0, 0, 0);
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.minDistance = 50;
        this.controls.maxDistance = 400;
        this.scene.add(new THREE.AmbientLight(0xffffff, 0.7));
        const sun = new THREE.DirectionalLight(0xffffff, 0.5);
        sun.position.set(0, 1000, 0);
        sun.castShadow = true;
        this.scene.add(sun);
        const moon = new THREE.DirectionalLight(0xffffff, 0.25);
        moon.position.set(0, -1000, 0);
        this.scene.add(moon);
        this.origin = new THREE.AxesHelper(1000);
        this.origin.name = "Origin";
        this.grid = new THREE.PolarGridHelper(200, 12, 8, 64, 0x808080);
        this.grid.name = "Grid";
        this.grid.position.y = -100;
        this.grid.position.x = -0;
        this.objects.push(this.grid);
        this.scene.add(this.grid);
        this.composer = new EffectComposer(this.renderer);
        const renderPass = new RenderPass(this.scene, this.camera);
        this.composer.addPass(renderPass);
        const boundaries = new THREE.Vector2(this.width, this.height);
        this.outlinePass = new OutlinePass(boundaries, this.scene, this.camera);
        this.outlinePass.visibleEdgeColor.set(new THREE.Color(0xffffff));
        this.outlinePass.hiddenEdgeColor.set(new THREE.Color(0x404040));
        this.outlinePass.usePatternTexture = false;
        this.outlinePass.edgeThickness = 1;
        this.outlinePass.edgeGlow = 1;
        this.outlinePass.edgeStrength = 2;
        this.outlinePass.pulsePeriod = 4;
        this.composer.addPass(this.outlinePass);
        const effectFXAA = new ShaderPass(FXAAShader);
        effectFXAA.uniforms['resolution'].value.set(1 / this.width, 1 / this.height);
        this.composer.addPass(effectFXAA);
        const animate = () => {
            if (this.camRotationSpeed != 0) {
                const pos = this.camera.position;
                this.camera.position.x = pos.x * Math.cos(this.camRotationSpeed) + pos.z * Math.sin(this.camRotationSpeed);
                this.camera.position.z = pos.z * Math.cos(this.camRotationSpeed) - pos.x * Math.sin(this.camRotationSpeed);
            }
            requestAnimationFrame(animate);
            this.controls.update();
            this.composer.render();
            if (this.onFrameCallBack) {
                this.onFrameCallBack();
            }
        };
        animate();
        this.animate = animate;
        this.renderer.domElement.addEventListener(`click`, (evt) => this.onClick(evt));
        document.addEventListener('keydown', this.onKeyDown.bind(this));
    }
    addObject(obj) {
        if (obj instanceof WBObject)
            obj = obj.toObject3D();
        obj = (!Array.isArray(obj)) ? [obj] : obj;
        for (const o of obj) {
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
    getObjectsByName(name, limit = undefined) {
        let arr = [];
        for (const obj of this.allObjects()) {
            if (obj.name.localeCompare(name) === 0) {
                arr.push(obj);
                if (limit && arr.length == limit)
                    return arr;
            }
        }
        return arr;
    }
    allObjects() {
        let arr = [];
        for (let obj of this.objects) {
            if (obj instanceof THREE.Group) {
                for (let subObj of obj.children) {
                    arr.push(subObj);
                }
            }
            else {
                arr.push(obj);
            }
        }
        return arr;
    }
    solo(name = undefined) {
        if (name) {
            for (let obj of this.allObjects()) {
                obj.visible = obj.name === name;
            }
        }
        else {
            for (let obj of this.allObjects()) {
                obj.visible = true;
            }
        }
    }
    onWindowResize() {
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.width, this.height);
        this.composer.setSize(this.width, this.height);
    }
    onClick(event) {
        event.preventDefault();
        this.mouse.x = (event.clientX / this.width) * 2 - 1;
        this.mouse.y = -(event.clientY / this.height) * 2 + 1;
        this.raycaster.setFromCamera(this.mouse, this.camera);
        let intersects = this.raycaster.intersectObjects(this.scene.children, true);
        if (intersects.length > 0) {
            for (let i = 0; i < intersects.length; i++) {
                if (intersects[i].object.visible) {
                    const object = intersects[i].object;
                    if (this.onClickCallBack)
                        this.onClickCallBack(object);
                    this.outlinePass.selectedObjects = [object];
                    this.objectWidget.setObject(object);
                    if (object instanceof THREE.Mesh && Object.keys(object.userData).length > 0)
                        this.dataWidget.setData(object.userData);
                    else
                        this.dataWidget.setData();
                    return;
                }
            }
        }
        this.dataWidget.setData();
    }
    onKeyDown(event) {
        let obj;
        switch (event.key) {
            case 'ArrowLeft':
            case 'ArrowRight':
            case 'ArrowUp':
            case 'ArrowDown':
                break;
            case 'r':
                if (this.camRotationSpeed)
                    this.rotate(false);
                else
                    this.rotate(true);
                break;
            case 'g':
                obj = this.scene.getObjectByName("Grid");
                if (obj)
                    this.removeObjectByName("Grid");
                else {
                    this.scene.add(this.grid);
                    this.objects.push(this.grid);
                    this.objectWidget.update();
                }
                break;
            case 'o':
                obj = this.scene.getObjectByName("Origin");
                if (obj)
                    this.removeObjectByName("Origin");
                else {
                    this.scene.add(this.origin);
                    this.objects.push(this.origin);
                    this.objectWidget.update();
                }
                break;
        }
    }
    rotate(on, speed = .2) {
        speed = (speed > 1) ? 1 : (speed < -1) ? -1 : speed;
        this.camRotationSpeed = (!on && this.camRotationSpeed != 0) ? 0 : speed * .025;
    }
}
//# sourceMappingURL=WB3DView.js.map