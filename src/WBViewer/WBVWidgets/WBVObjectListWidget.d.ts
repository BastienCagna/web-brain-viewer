import { WBObject } from "../../WBObjects/WBObject";
import WBVSectionWidget from "./WBVSectionWidget";
import { WBVWidget } from "./WBVWidget";
import { WBMergeRecipe } from "../../WBObjects/WBMergeRecipe";
import { WBServerModal } from "./WBVServerModal";
import { WBView } from "../WBView";
import { WBVObjectWidget } from "./WBVObjectWidget";
declare class WBVObjectListWidget extends WBVSectionWidget {
    items: WBVObjectWidget[];
    counts: {};
    mergeRecipes: WBMergeRecipe[];
    serverModal: WBServerModal;
    targetView: WBView;
    objectList: HTMLElement;
    constructor(parent?: WBVWidget, targetView?: WBView);
    getObjectList(): HTMLElement;
    checkName(name: string): string;
    checkMergingAvailability(): void;
    mergeSelected(value: any): void;
    addSelectedObjectsToTargetView(): void;
    addObject(file: Blob, filename?: string): void;
    selectedObjects(): WBObject[];
    bodyHtml(): string;
    update(): void;
    dragoverHandler(evt: any): void;
    dropHandler(evt: any): void;
}
export { WBVObjectListWidget };
