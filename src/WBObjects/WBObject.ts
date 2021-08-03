import {MathUtils} from 'three'; //"https://unpkg.com/three@0.126.1/build/three.module";
import generateUUID = MathUtils.generateUUID;

enum WBOState {
    None,
    Loading,
    Ready,
    Used,
    Error
}


abstract class WBObject {
    uid: string;
    id: string;
    type: string;
    state: WBOState;
    onStateChange = null;
    usages: number;

    protected constructor(id:string = null) {
        this.uid = generateUUID();
        this.id = (!id) ? this.uid : id;
        this.state = WBOState.None;
        this.usages = 0;
    }

    updateState(state: WBOState): void {
        if(this.state !== state) {
            this.state = state;
            if (this.onStateChange) {
                this.onStateChange(this);
            }
        }
    }

    toObject3D(): THREE.Object3D|THREE.Object3D[] {
        return null;
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
            this.updateState(WBOState.Ready);

            // Reset fr
            this.fr = new FileReader();
            this.fr.onload = () => { this.parseFile() };
        };
    }

    loadFile(file:File) {
        this.id = file.name;
        this.updateState(WBOState.Loading);
        this.fr.readAsText(file);
    }

    abstract parseFile(): void;
}
/*
abstract class WB3DObject extends WBObject {
    abstract getMesh();
}*/

export { WBObject, WBTextReadableObject, WBOState };
