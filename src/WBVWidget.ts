// @ts-ignore
import {MathUtils} from "https://unpkg.com/three@0.126.1/build/three.module.js";
import generateUUID = MathUtils.generateUUID;


/**
 * Abstract class for any HTML object that need to be updated.
 */
export abstract class WBVWidget {
  id : string;
  parentId : string;

  /**
   * Set parentId and create a unique id if not provided.
   * This constructor does not perform HTML rendering.
   * @param parentId
   * @param id
   * @protected
   */
  protected constructor(parentId: string = null, id: string = null) {
    this.id = (!id) ? generateUUID() : id;
    this.parentId = parentId;
  }

  /**
   * Generate HTML script to display the element.
   */
  abstract html(): string;

  /**
   * Render the HTML element in the page.
   * A new element is append to the parent if the element defined by the id of this object does not exist yet.
   */
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
    }
  }
}
