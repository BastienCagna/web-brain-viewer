import WBVSectionWidget from "./WBVSectionWidget";
export default class WBVThreeMeshWidget extends WBVSectionWidget {
    constructor(parent = null, mesh) {
        super(parent, "Mesh options");
        this.mesh = mesh;
    }
    bodyHtml() {
        let html = "<p><b>Name:</b> " + this.mesh.name + "";
        return html;
    }
}
//# sourceMappingURL=WBVThreeMeshWidget.js.map