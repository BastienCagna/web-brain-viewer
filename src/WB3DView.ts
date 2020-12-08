import * as THREE from "../dependencies/three.js/build/three.module.js";
import {BasicShadowMap} from "../dependencies/three.js/build/three.module.js";
import { WBView } from './WBView.js';
import {OrbitControls} from '../dependencies/three.js/examples/jsm/controls/OrbitControls.js';

/**
 * WB3DView
 */
export default class WB3DView extends WBView {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  controls: OrbitControls;
  raycaster: THREE.Raycaster;
  mouse = new THREE.Vector2();

  clickInfosSection = false;

  constructor(parentId: string, id: string = null, width:number = null,
              height:number = null) {
    super(parentId, id, width, height);
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
    this.camera.position.x = 0;
    this.camera.position.y = 100;
    this.camera.lookAt(0, 0, 0);

    this.controls = new OrbitControls( this.camera, this.renderer.domElement );
    this.controls.minDistance = 50;
    this.controls.maxDistance = 400;

    this.scene.add( new THREE.AmbientLight( 0xffffff, 0.6 ));
    const sun = new THREE.DirectionalLight( 0xffffff, 0.5 );
    sun.position.set(0, 0, -1000);
    this.scene.add(sun);

    const geometry = new THREE.BoxGeometry(50, 50, 50);
    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    const cube = new THREE.Mesh( geometry, material );
    this.scene.add( cube );

    const animate = (): void => {
      // Render with a fps of 60, and stop when changing browser tab
      requestAnimationFrame(animate);
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
      // this.renderMessage = '<p>Camera: x:' + this.camera.position.x + ' y:' + this.camera.position[0] + ' z:' + this.camera.position[2] + '</p>';

      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
    };
    animate();
    this.renderer.domElement.addEventListener(`click`, (evt) => this.onClick(evt));
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
}
