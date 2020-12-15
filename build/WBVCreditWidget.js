import WBVSectionWidget from "./WBVSectionWidget.js";
export default class WBVCreditWidget extends WBVSectionWidget {
    constructor(parentId = null, id = null) {
        super(parentId, id);
        this.title = "About";
    }
    bodyHtml() {
        let html = '<p>Author: Bastien Cagna - <a href="">Github repo</a> - <a href="">Documentation</a></p>';
        return html;
    }
}
//# sourceMappingURL=WBVCreditWidget.js.map