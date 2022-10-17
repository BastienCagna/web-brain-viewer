import { WBView } from "../WBView";
import WBVSectionWidget from "./WBVSectionWidget";
export default class WBVViewWidget extends WBVSectionWidget {
    view: WBView;
    constructor(view: WBView, title?: string, classnames?: string[] | string);
    bodyHtml(): string;
    setView(view: WBView): void;
}
