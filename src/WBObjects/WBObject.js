import { MathUtils } from 'three';
var generateUUID = MathUtils.generateUUID;
var WBOState;
(function (WBOState) {
    WBOState[WBOState["None"] = 0] = "None";
    WBOState[WBOState["Loading"] = 1] = "Loading";
    WBOState[WBOState["Ready"] = 2] = "Ready";
    WBOState[WBOState["Used"] = 3] = "Used";
    WBOState[WBOState["Error"] = 4] = "Error";
})(WBOState || (WBOState = {}));
class WBObject {
    constructor(id = null) {
        this.onStateChange = null;
        this.uid = generateUUID();
        this.id = (!id) ? this.uid : id;
        this.state = WBOState.None;
        this.usages = 0;
    }
    updateState(state) {
        if (this.state !== state) {
            this.state = state;
            if (this.onStateChange) {
                this.onStateChange(this);
            }
        }
    }
    toObject3D() {
        return null;
    }
}
class WBTextReadableObject extends WBObject {
    constructor(id = null) {
        super(id);
        this.fr = null;
        this.onLoadEnd = null;
        this.fr = new FileReader();
        this.fr.onload = () => { this.parseFile(); };
        this.fr.onloadend = () => {
            if (this.onLoadEnd) {
                this.onLoadEnd();
            }
            this.updateState(WBOState.Ready);
            this.fr = new FileReader();
            this.fr.onload = () => { this.parseFile(); };
        };
    }
    loadFile(file) {
        this.id = file.name;
        this.updateState(WBOState.Loading);
        this.fr.readAsText(file);
    }
}
export { WBObject, WBTextReadableObject, WBOState };
//# sourceMappingURL=WBObject.js.map