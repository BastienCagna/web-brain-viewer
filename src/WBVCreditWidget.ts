import WBVSectionWidget from "./WBVSectionWidget.js";


export default class WBVCreditWidget extends WBVSectionWidget {
    constructor(parentId:string = null, id:string = null) {
        super(parentId, id);
        this.title = "About";
    }

    bodyHtml(): string {
        let html = '<h4>Resources</h4>' +
            '<p><a href="https://github.com/BastienCagna/web-brain-viewer" target="_blank">Github repo</a> ' +
            '- <a href="https://www.bablab.fr/web-brain-viewer/docs" target="_blank">Documentation</a></p>' +
            '<h4>Credit</h4><p>Author: <a href="https://www.bablab.fr" target="_blank">Bastien Cagna</a></p>' +
            '<p>Based on: <a href="https://threejs.org/" target="_blank">Three.js</a></p>' ;
        return html;
    }
}
