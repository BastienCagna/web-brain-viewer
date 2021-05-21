import WBVSectionWidget from "./WBVSectionWidget.js";
import {WBVWidget} from "./WBVWidget";


export default class WBVCreditWidget extends WBVSectionWidget {
    constructor(parent:WBVWidget = null) {
        super(parent);
        this.title = "About";
    }

    bodyHtml(): string {
        let html = '<p>Version: 0.0.1</p><h4>Resources</h4>' +
            '<p><a href="https://github.com/BastienCagna/web-brain-viewer" target="_blank">Github repo</a> ' +
            '- <a href="https://www.bablab.fr/web-brain-viewer/docs" target="_blank">Documentation</a></p>' +
            '<h4>Credit</h4><p>Author: <a href="https://www.bablab.fr" target="_blank">Bastien Cagna</a></p>' +
            '<p>Based on: <a href="https://threejs.org/" target="_blank">Three.js</a></p>' ;
        return html;
    }
}
