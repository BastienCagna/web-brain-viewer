import * as THREE from 'three';
import { WBObject, WBTextReadableObject } from "./WBObject";
import { WBMeshesObject, WBMeshObject } from "./WBSurfacesObjects";
import { WBMergeRecipe } from "./WBMergeRecipe";
import { WBColorMap } from "./WBColorMap";
declare class WBMorphFoldObject extends WBObject {
    label: WBMorphFoldLabelObject;
    metadata: {};
    mesh: WBMeshObject;
    constructor(id?: string, metadata?: {});
}
declare class WBMorphFoldLabelObject extends WBObject {
    name: string;
    label: number;
    color: THREE.Color;
    constructor(id?: string, name?: string, label?: number, color?: THREE.Color);
}
declare class WBMorphNomenclatureObject extends WBTextReadableObject {
    name: string;
    folds: WBMorphFoldLabelObject[];
    constructor(id?: string);
    parseFile(): void;
    getLabelByName(name: string): WBMorphFoldLabelObject;
    getLabelByLabel(label: number): WBMorphFoldLabelObject;
}
declare class WBMorphFoldsInfosObject extends WBTextReadableObject {
    metadataArray: [];
    header: {};
    constructor(id?: string);
    parseFile(): void;
}
declare class WBMorphLabellingObject extends WBObject {
    foldsInfos: WBMorphFoldsInfosObject;
    folds: WBMorphFoldObject[];
    labellingKey: string;
    labelKey: string;
    nomenclature: WBMorphNomenclatureObject;
    meshes: WBMeshesObject;
    brainMesh: WBMeshObject;
    constructor(id?: string, meshes?: WBMeshesObject, foldsInfos?: WBMorphFoldsInfosObject, brainMesh?: WBMeshObject, nomenclature?: WBMorphNomenclatureObject, labelKey?: string);
    checkState(): void;
    setFolds(labellingKey?: string): void;
    toObject3D(nameKey?: string, colorValue?: string, data?: {}, cmap?: WBColorMap): THREE.Mesh[];
}
declare class WBMorphLabellingRecipe extends WBMergeRecipe {
    constructor();
    merge(id: string, objects: WBObject[]): WBMorphLabellingObject;
}
export { WBMorphNomenclatureObject, WBMorphFoldsInfosObject, WBMorphFoldLabelObject, WBMorphFoldObject, WBMorphLabellingObject, WBMorphLabellingRecipe };
