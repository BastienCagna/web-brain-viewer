import {MathUtils} from "../dependencies/three.js/build/three.module.js";
import generateUUID = MathUtils.generateUUID;


export abstract class WBVWidget {
  id = null;
  parentId = null;

  protected constructor(parentId: string = null, id: string = null) {
    this.id = (!id) ? generateUUID() : id;
    this.parentId = parentId;
  }

  abstract html(): string;

  public update(): void {
    const el = document.getElementById(this.id);
    if(el) {
      el.outerHTML = this.html();
    }
    else if(this.parentId) {
      const parent = document.getElementById(this.parentId);
      if(parent){
        parent.innerHTML += this.html();
      }
      else {
        throw new Error("Parent #" + this.parentId + " cannot be found.");
      }
    }
  }
}
