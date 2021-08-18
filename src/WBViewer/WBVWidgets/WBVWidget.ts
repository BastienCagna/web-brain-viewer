import {MathUtils} from 'three';//"https://unpkg.com/three@0.126.1/build/three.module";
import generateUUID = MathUtils.generateUUID;


/**
 * Abstract class for any HTML object that need to be updated.
 */
export abstract class WBVWidget {
    id : string;
    parent : WBVWidget|HTMLElement;
    classnames: string[];
    tag: string;

    /**
     * Set parent and create a unique id if not provided.
     * This constructor does not perform HTML rendering.
     * @param parent
     * @param classnames
     * @protected
     */
    protected constructor(parent : WBVWidget|HTMLElement = null, classnames : string[]|string = []) {
        this.id = generateUUID();
        this.parent = parent;
        this.classnames = Array.isArray(classnames)? classnames : [classnames];
        this.tag = "div";
    }

    /**
     * Generate HTML script to display the element.
     */
    abstract innerHTML(): string;

    /**
     * Render the HTML element in the page.
     * A new element is append to the parent if the element defined by the id of this object does not exist yet.
     */
    public update(): void {
        const classnames = this.classnames.join(' ');
        const divHTML = '<' + this.tag + ' id="' + this.id + '" class="' + classnames + '">' + this.innerHTML() + '</' + this.tag +'>';

        const el = document.getElementById(this.id);
        if(el) {
            el.outerHTML = divHTML;
        }
        else if(this.parent) {
            const parentElement = (this.parent instanceof Element)? this.parent : document.getElementById(this.parent.id);
            if(parentElement){
                parentElement.innerHTML += divHTML;
            }
        }
    }
}
