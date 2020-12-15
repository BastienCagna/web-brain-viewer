import WBVSectionWidget from "./WBVSectionWidget.js";


export default class WBVCreditWidget extends WBVSectionWidget {
    constructor(parentId:string = null, id:string = null) {
        super(parentId, id);
        this.title = "About";
    }

    bodyHtml(): string {
        let html = '<p>Author: Bastien Cagna - <a href="">Github repo</a> - <a href="">Documentation</a></p>';
        return html;
    }
}