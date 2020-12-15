import WBVSectionWidget from "./WBVSectionWidget";
export default class WBVMeshWidget extends WBVSectionWidget {
    constructor(parentId = null, mesh) {
        super(parentId, "Mesh options");
        this.mesh = mesh;
    }
    bodyHtml() {
        let html = "<p><b>Name:</b> " + this.mesh.name + "";
        return "";
    }
}
//# sourceMappingURL=WBVMeshWidget.js.map