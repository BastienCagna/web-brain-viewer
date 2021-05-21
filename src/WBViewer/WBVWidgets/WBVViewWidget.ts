import { WBView } from "../WBView.js";
import WBVSectionWidget from "./WBVSectionWidget.js";
import {WBVWidget} from "./WBVWidget";


export default class WBVViewWidget extends WBVSectionWidget {
    view: WBView;

    constructor(view: WBView, title:string = 'View Infos', classnames : string[]|string = []) {
        super(view.toolbar, title, classnames);
        this.view = view;
    }

    bodyHtml(): string {
        if(!this.view) {
            return '<p>No selected view.</p>';
        }
        else {
            let html = '<h4>' + this.view.title + '</h4>';
            return html;
        }
    }

    setView(view: WBView): void {
        this.view = view;
        this.update();
    }

}
