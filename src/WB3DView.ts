import * as THREE from "../dependencies/three.js/build/three.module.js";
import {BasicShadowMap} from "../dependencies/three.js/build/three.module.js";
import {OrbitControls} from '../dependencies/three.js/examples/jsm/controls/OrbitControls.js';
import {TrackballControls} from '../dependencies/three.js/examples/jsm/controls/TrackballControls.js';
import { WBView } from './WBView.js';
import {WBObject} from "./WBObject.js";
import WBV3DViewWidget from "./WBV3DViewWidget.js";
import WBVViewWidget from "./WBVViewWidget.js";
import WBV3DObjectWidget from "./WB3DObjectWidget.js";

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
    objectWidget;
    animate;

    /** Show/Hide information when clicking in the scene. **/
    clickInfosSection = false;

    constructor(parentId: string, id: string = null, title = null, width:number = null,
                height:number = null) {
        super(parentId, id, width, height);
        this.viewWidget = new WBV3DViewWidget(this);
        this.objectWidget = new WBV3DObjectWidget(this);
        this.toolbar.widgets.push(this.viewWidget);
        this.toolbar.widgets.push(this.objectWidget);

        this.type = "3D";
        this.title = title;
        super.update();

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera( 75, this.width / this.height, 0.1, 1000 );
        this.raycaster = new THREE.Raycaster();

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize( this.width, this.height);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = BasicShadowMap;
        this.renderer.physicallyCorrectLights = true;
        this.viewElement().appendChild(this.renderer.domElement);

        this.camera.position.z = 0;
        this.camera.position.x = 200;
        this.camera.position.y = 200;
        this.camera.lookAt(0, 0, 0);

        /*this.controls = new OrbitControls( this.camera, this.renderer.domElement );
        this.controls.minDistance = 50;
        this.controls.maxDistance = 400;*/

        this.controls = new TrackballControls(this.camera, this.renderer.domElement);
        this.controls.rotateSpeed = 2.0;

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
            // this.renderMessage = '<p>Camera: x:' + this.camera.position.x + ' y:' + this.camera.position[0] + ' z:' + this.camera.position[2] + '</p>';
        };
        animate();
        this.animate = animate;
        this.renderer.domElement.addEventListener(`click`, (evt) => this.onClick(evt));
    }

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

    onClick( event ): void {
        event.preventDefault();

        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.scene.children);
        if (intersects.length > 0) {

            const object = intersects[0].object;

            if (object instanceof THREE.Mesh && Object.keys(object.userData).length > 0) {
                console.log(object.name);
                let txt = '<h3>' + object.name + '</h3>';
                txt += '<table class="table"><tr><th>Key</th><th>Value</th></tr>';
                for (const key of Object.keys(object.userData)) {
                    txt += '<tr><td>' + key + '</td><td>' + object.userData[key] + '</td>';
                }
                txt += '</table>';
                //this.infos = txt;
                this.clickInfosSection = true;
            } else {
                this.clickInfosSection = false;
            }
        } else {
            this.clickInfosSection = false;
        }
    }

    /*
    // dom
    container2 = document.getElementById('inset');

    // renderer
    renderer2 = new THREE.WebGLRenderer();
    renderer2.setClearColor( 0xf0f0f0, 1 );
    renderer2.setSize( CANVAS_WIDTH, CANVAS_HEIGHT );
    container2.appendChild( renderer2.domElement );

    // scene
    scene2 = new THREE.Scene();

    // camera
    camera2 = new THREE.PerspectiveCamera( 50, CANVAS_WIDTH / CANVAS_HEIGHT, 1, 1000 );
    camera2.up = camera.up; // important!

    // axes
    axes2 = new THREE.AxisHelper( 100 );
    scene2.add( axes2 );
     */
}
