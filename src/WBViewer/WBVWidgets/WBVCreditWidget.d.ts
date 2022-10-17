import WBVSectionWidget from "./WBVSectionWidget";
import { WBVWidget } from "./WBVWidget";
export default class WBVCreditWidget extends WBVSectionWidget {
    constructor(parent?: WBVWidget);
    bodyHtml(): string;
}
