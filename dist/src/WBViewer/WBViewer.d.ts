import { WBVWidget } from "./WBVWidgets/WBVWidget";
import WBVToolBar from "./WBVWidgets/WBVToolBar";
import { WBVObjectListWidget } from './WBVWidgets/WBVObjectListWidget';
import { WBVViewListWidget } from './WBVWidgets/WBVViewListWidget';
import { WBView } from "./WBView";
export declare class WBViewer extends WBVWidget {
    viewerToolbar: WBVToolBar;
    viewToolbar: WBVToolBar;
    name: string;
    activeView: WBView;
    objectList: WBVObjectListWidget;
    viewList: WBVViewListWidget;
    constructor(parent: WBVWidget | HTMLElement, name?: string, classnames?: string[] | string);
    changeView(id: string): void;
    innerHTML(): string;
    update(): void;
}
