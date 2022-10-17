import * as THREE from 'three';
import { WBNiftiDataType, WBNiftiIntent } from "./WBNifti";
import { WBTextReadableObject } from "./WBObject";
import { WBMeshesObject, WBMeshObject, WBTextureObject } from "./WBSurfacesObjects";
declare enum WBArrayIndenxingOrder {
    RowMajorOrder = 0,
    ColumnMajorOrder = 1
}
declare enum WBEndian {
    LittleEndian = 0,
    BigEndian = 1
}
declare class WBGiftiDataArray {
    intent: WBNiftiIntent;
    dtype: WBNiftiDataType;
    encoding: any;
    endian: WBEndian;
    coordsys: any;
    indexingOrder: WBArrayIndenxingOrder;
    extFileName: any;
    extOffset: any;
    shape: any[];
    data: any;
    meta: {};
    constructor(data?: [], intent?: WBNiftiIntent, dtype?: WBNiftiDataType);
    parseDom(element: any): boolean;
}
declare class WBGiftiImage extends WBTextReadableObject {
    version: string;
    numberOfDataArrays: number;
    darrays: any[];
    metadata: {};
    labeltable: any[];
    meshes: WBMeshObject[];
    textures: WBTextureObject[];
    nameKey: string;
    constructor(id?: string, file?: File | Blob);
    loadFile(file: File | Blob): void;
    parseFile(): void;
    parseXML(xml: string): void;
    parseDom(element: any): void;
    setMeshes(): void;
    toWBMorphMeshesObject(): WBMeshesObject;
    toObject3D(): THREE.Object3D[];
}
export { WBGiftiImage, WBGiftiDataArray };
