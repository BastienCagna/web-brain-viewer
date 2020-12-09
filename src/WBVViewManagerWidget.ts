import { WBView } from "./WBView.js";
import WBVSectionWidget from "./WBVSectionWidget.js";

export default class WBVViewManagerWidget extends WBVSectionWidget {
    view: WBView;

    constructor(parentId: string = null) {
        super(parentId, 'View Infos');
    }

    bodyHtml(): string {
        if(!this.view) {
            return '<p>No selected view.</p>';
        }
        else {
            return '<h4>' + this.view.title + '</h4>';
        }
    }

    setView(view: WBView): void {
        this.view = view;
        this.update();
    }
}