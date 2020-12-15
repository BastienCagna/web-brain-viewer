import WBVSectionWidget from "./WBVSectionWidget";
export default class WBVObject3DWidget extends WBVSectionWidget {
    constructor(parentId = null, object) {
        super(parentId, "Mesh options");
        this.mesh = mesh;
    }
    bodyHtml() {
        let html = "<p><b>Name:</b> " + this.mesh.name + "";
        return "";
    }
}
//# sourceMappingURL=WBVObject3DWidget.js.map