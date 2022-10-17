import { WBVWidget } from "./WBVWidget";
import { WBObject, WBTextReadableObject } from "../../WBObjects/WBObject";
declare enum WBVOType {
    WBVODefault = 0,
    WBVOTr = 1,
    WBVOLi = 2
}
declare class WBVObjectWidget extends WBVWidget {
    object: WBObject;
    type: WBVOType;
    constructor(parent?: WBVWidget | HTMLElement, object?: WBObject, type?: WBVOType);
    innerHTML(): string;
}
declare class WBVTextReadableObjectWidget extends WBVObjectWidget {
    selected: boolean;
    constructor(parent?: WBVWidget | HTMLElement, file?: File | Blob, fid?: string, type?: WBVOType);
    loadFile(file: File | Blob, fid?: string): WBTextReadableObject;
}
export { WBVObjectWidget, WBVOType, WBVTextReadableObjectWidget };
