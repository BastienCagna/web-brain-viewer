/**
 * WBViewer
 *
 * Abstract class for 2D and 3D viewers
 * **/
import * as THREE from "../dependencies/three.js/build/three.module.js";
import WBVToolBar from './WBVToolBar.js';
import {WBVWidget} from './WBVWidget.js';

class WB3DCross extends THREE.Vector3 {
  vector = null;
  visible = false;
  color: THREE.Color;

  constructor(x= 0, y= 0, z= 0) {
    super(x, y, z);
  }

  setPosition(x, y, z): void {
    this.vector.x = x;
    this.vector.y = y;
    this.vector.z = z;
  }
}


export abstract class WBView extends WBVWidget {
  title: string;
  type: string;
  toolbar = null;
  objects = [];
  mouse: THREE.Vector2;
  cursor: WB3DCross;
  origin: WB3DCross;
  height:number = null;
  width: number = null;

  protected constructor(parentId: string = null, id: string = null, width:number = null,
                        height:number = null) {
    super(parentId, null);
    this.toolbar = new WBVToolBar();
    if(this.parentId) {
      const parent = document.getElementById(this.parentId);
      this.height = (!height) ? parent.clientHeight : height;
      this.width = (!width) ? parent.clientWidth : width;
    }
    else {
      this.height = (!height) ? window.innerHeight : height;
      this.width = (!width) ? window.innerWidth : width;
    }
  }

  html(): string {
    let html = '<div class="row" id="' + this.id + '">';
    html += '<div class="col-md-1 wbv-tb">Abstract NViewer <p id="coco">test</p></div>';
    html += '<div class="col-md-11 wbv-screen" id="' + this.id + '_screen"></div>';
    return html;
  }

  viewElement(): HTMLElement {
    return document.getElementById(this.id + '_screen');
  }
}
