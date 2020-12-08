import {MathUtils} from "../dependencies/three.js/build/three.module.js";
import generateUUID = MathUtils.generateUUID;


enum WBOState {
    WBONone,
    WBOLoading,
    WBOReady,
    WBOUsed,
    WBOError
}

abstract class WBObject {
    uid: string;
    id: string;
    type: string;
    state: WBOState;
    onStateChange = null;

    protected constructor(id:string = null) {
        this.uid = generateUUID();
        this.id = (!id) ? this.uid : id;
        this.state = WBOState.WBONone;
    }

    updateState(state: WBOState): void {
        this.state = state;
        if(this.onStateChange) {
            this.onStateChange(this);
        }
    }
}


abstract class WBTextReadableObject extends WBObject {
    fr: FileReader = null;
    onLoadEnd = null;

    protected constructor(id:string = null) {
        super(id);
        this.fr = new FileReader();
        this.fr.onload = () => { this.parseFile(); };
        this.fr.onloadend = () => {
            if(this.onLoadEnd) {
                this.onLoadEnd();
            }
            this.updateState(WBOState.WBOReady);

            // Reset fr
            this.fr = new FileReader();
            this.fr.onload = () => { this.parseFile() };
        };
    }

    loadFile(file:File) {
        this.id = file.name;
        this.fr.readAsText(file);
        this.updateState(WBOState.WBOLoading);
    }

    abstract parseFile(): void;
}

export { WBObject, WBTextReadableObject, WBOState };