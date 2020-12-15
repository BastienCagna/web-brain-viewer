import WBVSectionWidget from "./WBVSectionWidget";
export default class WBVThreeMeshWidget extends WBVSectionWidget {
    constructor(parentId = null, mesh) {
        super(parentId, "Mesh options");
        this.mesh = mesh;
    }
    bodyHtml() {
        let html = "<p><b>Name:</b> " + this.mesh.name + "";
        return "";
    }
}
//# sourceMappingURL=WBVThreeMeshWidget.js.map