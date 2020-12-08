import { MathUtils } from "../dependencies/three.js/build/three.module.js";
var generateUUID = MathUtils.generateUUID;
var WBOState;
(function (WBOState) {
    WBOState[WBOState["WBONone"] = 0] = "WBONone";
    WBOState[WBOState["WBOLoading"] = 1] = "WBOLoading";
    WBOState[WBOState["WBOReady"] = 2] = "WBOReady";
    WBOState[WBOState["WBOUsed"] = 3] = "WBOUsed";
    WBOState[WBOState["WBOError"] = 4] = "WBOError";
})(WBOState || (WBOState = {}));
class WBObject {
    constructor(id = null) {
        this.onStateChange = null;
        this.uid = generateUUID();
        this.id = (!id) ? this.uid : id;
        this.state = WBOState.WBONone;
    }
    updateState(state) {
        this.state = state;
        if (this.onStateChange) {
            this.onStateChange(this);
        }
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
            this.updateState(WBOState.WBOReady);
            this.fr = new FileReader();
            this.fr.onload = () => { this.parseFile(); };
        };
    }
    loadFile(file) {
        this.id = file.name;
        this.fr.readAsText(file);
        this.updateState(WBOState.WBOLoading);
    }
}
export { WBObject, WBTextReadableObject, WBOState };
//# sourceMappingURL=WBObject.js.map