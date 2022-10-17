import WB3DView from "../WB3DView";
import WBVSectionWidget from "./WBVSectionWidget";
export default class WBV3DCameraWidget extends WBVSectionWidget {
    view: WB3DView;
    constructor(view: WB3DView, classnames?: string[] | string);
    bodyHtml(): string;
    onCameraChange(): void;
}
