import * as THREE from 'three';
import { WBObject } from "./WBObject";
import { WBMergeRecipe } from "./WBMergeRecipe";
declare class WBMeshObject extends WBObject {
    vertices: [];
    triangles: [];
    offset: THREE.Vector3;
    offsetType: string;
    metadata: {};
    constructor(id: string, vertices: [], triangles: [], offset?: THREE.Vector3 | string);
    checkState(): void;
    setOffset(offset?: THREE.Vector3 | string): void;
    estimateOffset(): void;
    asThreeMesh(color?: number | THREE.Color, metadata?: {}, metadataMerge?: boolean, scale?: number): THREE.Mesh;
    toObject3D(): THREE.Object3D;
}
declare class WBMeshesObject extends WBObject {
    meshes: WBMeshObject[];
    offset: THREE.Vector3;
    offsetType: string;
    constructor(id?: string, offset?: THREE.Vector3 | string);
    addMesh(mesh: WBMeshObject): void;
    setMeshes(meshes: WBMeshObject[]): void;
    setOffset(offset?: THREE.Vector3 | string): void;
    updateOffsets(): void;
}
declare class WBTextureObject extends WBObject {
    values: number[];
    metadata: {};
    constructor(id?: string);
}
declare class WBTexturedMeshObject extends WBObject {
    mesh: WBMeshObject;
    texture: WBTextureObject;
    constructor(id?: string, mesh?: WBMeshObject, texture?: WBTextureObject);
}
declare class WBTexturedMeshRecipe extends WBMergeRecipe {
    constructor();
    merge(id: string, objects: WBObject[]): WBTexturedMeshObject;
}
export { WBMeshObject, WBMeshesObject, WBTextureObject, WBTexturedMeshObject, WBTexturedMeshRecipe };
