import { WBView } from "../WBView";
import WBVSectionWidget from "./WBVSectionWidget";
import { WBVWidget } from "./WBVWidget";
declare class WBVViewListWidget extends WBVSectionWidget {
    views: WBView[];
    constructor(parent?: WBVWidget);
    addView(view: WBView): void;
    getView(id: string): WBView;
    bodyHtml(): string;
    update(): void;
}
export { WBVViewListWidget };
