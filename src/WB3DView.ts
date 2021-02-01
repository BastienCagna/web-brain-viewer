import * as THREE from "../dependencies/three.js/build/three.module.js";
import {BasicShadowMap} from "../dependencies/three.js/build/three.module.js";
import {OrbitControls} from '../dependencies/three.js/examples/jsm/controls/OrbitControls.js';
import {TrackballControls} from '../dependencies/three.js/examples/jsm/controls/TrackballControls.js';
import { WBView } from './WBView.js';
import {WBObject} from "./WBObject.js";
import WBV3DViewWidget from "./WBV3DViewWidget.js";
import WBVViewWidget from "./WBVViewWidget.js";
import WBV3DObjectWidget from "./WB3DObjectWidget.js";
import WBVMetaDataWidget from "./WBVMetaDataWidget.js";
import WBV3DCameraWidget from "./WBV3DCameraWidget.js";

/**
 * WB3DView
 */
export default class WB3DView extends WBView {
    /** Displayed scene **/
    scene: THREE.Scene;
    /** 3D Camera **/
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    controls: TrackballControls|OrbitControls;
    raycaster: THREE.Raycaster;
    mouse = new THREE.Vector2();
    viewWidget: WBV3DViewWidget;
    objectWidget: WBV3DObjectWidget;
    dataWidget: WBVMetaDataWidget;
    cameraWidget: WBV3DCameraWidget;
    animate;

    /**
     * Init a 3D view.
     * Create a toolbar containing a 3DViewWidget and a 3DObjectWidget to manage the rendering of objects.
     * Then, create the ThreeJS scene with lights, camera, control, helper and renderer
     * @param parentId
     * @param id
     * @param title
     * @param width
     * @param height
     */
    constructor(parentId: string, id: string = null, title = null, width:number = null,
                height:number = null) {
        super(parentId, id, width, height);

        // Toolbar
        this.objectWidget = new WBV3DObjectWidget(this);
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
        this.camera = new THREE.PerspectiveCamera( 75, this.width / this.height, 0.1, 1000 );
        this.raycaster = new THREE.Raycaster();

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize( this.width, this.height);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = BasicShadowMap;
        this.renderer.physicallyCorrectLights = true;
        this.renderer.localClippingEnabled = true;
        this.viewElement().appendChild(this.renderer.domElement);

        this.camera.position.z = 100;
        this.camera.position.x = 100;
        this.camera.position.y = 100;
        this.camera.lookAt(0, 0, 0);

        /*this.controls = new OrbitControls( this.camera, this.renderer.domElement );
        this.controls.minDistance = 50;
        this.controls.maxDistance = 400;*/

        this.controls = new TrackballControls(this.camera, this.renderer.domElement);
        this.controls.rotateSpeed = 2.0;
        this.controls.addEventListener('change', this.cameraWidget.onCameraChange);

        this.scene.add( new THREE.AmbientLight( 0xffffff, 0.7 ));
        const sun = new THREE.DirectionalLight( 0xffffff, 0.5 );
        const moon = new THREE.DirectionalLight( 0xffffff, 0.25 );
        sun.position.set(0, 0, 1000);
        moon.position.set(0, 0, -1000);
        this.scene.add(sun);
        this.scene.add(moon);

        const axesHelper = new THREE.AxesHelper(1000);
        axesHelper.name = "Origin"
        this.objects.push(axesHelper);
        this.scene.add(axesHelper);

        const animate = (): void => {
            // Render with a fps of 60, and stop when changing browser tab
            requestAnimationFrame(animate);
            this.controls.update();
            this.renderer.render(this.scene, this.camera);
        };
        animate();
        this.animate = animate;
        this.renderer.domElement.addEventListener(`click`, (evt) => this.onClick(evt));
    }

    /**
     * Add an object to the scene or update it if already existing in the scene.
     * Update the view and object widgets.
     * @param obj - Object to add to the scene
     */
    addObject(obj: WBObject): void {
        let obj3d = obj.toObject3D();
        obj3d = (!Array.isArray(obj3d)) ? [obj3d] : obj3d;

        for(const o of obj3d) {
            let allReadyExisting = false;
            for(let i = 0; i < this.objects.length; i++) {
                if(this.objects[i].name.localeCompare(o.name) === 0) {
                    this.objects[i] = o;
                    allReadyExisting = true;
                    break;
                }
            }
            if(!allReadyExisting) {
                this.objects.push(o);
                this.scene.add(o);
            }
        }
        this.viewWidget.update();
        this.objectWidget.update();
    }

    removeObjectByName(name: string): void {
        for(let i = 0; i < this.objects.length; i++) {
            if(this.objects[i].name.localeCompare(name) === 0) {
                this.objects.splice(i, 1);
                break;
            }
        }
        this.scene.remove(this.scene.getObjectByName(name));
        this.animate();
        this.viewWidget.update();
        this.objectWidget.update();
    }

    /**
     * Manage click in the 3D scene.
     * @param event
     */
    onClick( event ): void {
        event.preventDefault();

        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        let intersects = this.raycaster.intersectObjects(this.scene.children, true);

        if (intersects.length > 0) {
            for (let i = 0; i < intersects.length; i++) {
                if (intersects[i].object.visible) {
                    const object = intersects[i].object;
                    this.objectWidget.setObject(object);
                    console.log(object);
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

    onWindowResize(){
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize( window.innerWidth, window.innerHeight );
    }
}
