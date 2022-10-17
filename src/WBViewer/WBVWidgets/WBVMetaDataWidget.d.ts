import WBVSectionWidget from "./WBVSectionWidget";
import { WBVWidget } from "./WBVWidget";
export default class WBVMetaDataWidget extends WBVSectionWidget {
    data: {};
    constructor(parent?: WBVWidget | HTMLElement, data?: {}, classnames?: string[] | string);
    bodyHtml(): string;
    setData(data?: {}): void;
}
