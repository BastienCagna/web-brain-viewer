import WBVSectionWidget from "./WBVSectionWidget.js";
export default class WBV3DObjectWidget extends WBVSectionWidget {
    constructor(obj = null) {
        super('Object infos');
        this.object = obj;
    }
    bodyHtml() {
        if (!this.object) {
            return '<p>No selected object.</p>';
        }
        else {
            return '<p>' + this.object.name + '</p>';
        }
    }
}
//# sourceMappingURL=WB3DObjectWidget.js.map