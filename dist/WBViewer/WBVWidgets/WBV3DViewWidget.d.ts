import WBVViewWidget from "./WBVViewWidget";
import WB3DView from "../WB3DView";
import WBV3DObjectWidget from "./WBV3DObjectWidget";
export default class WBV3DViewWidget extends WBVViewWidget {
    view: WB3DView;
    objectWidget: WBV3DObjectWidget;
    constructor(view: WB3DView, objectWidget?: WBV3DObjectWidget, classnames?: string[] | string);
    bodyHtml(): string;
}
