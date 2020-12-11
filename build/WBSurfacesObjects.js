import * as THREE from "../dependencies/three.js/build/three.module.js";
import { WBObject, WBOState } from "./WBObject.js";
import { WBMergeRecipe } from "./WBMergeRecipe.js";
class WBMeshObject extends WBObject {
    constructor(id = null, vertices, triangles, offset = null) {
        super(id);
        this.offset = offset;
        this.vertices = vertices;
        this.triangles = triangles;
    }
    checkState() {
        if ((!this.vertices || !this.triangles) && this.state != WBOState.Error)
            this.updateState(WBOState.Error);
        else
            this.updateState(WBOState.Ready);
    }
    estimateOffset() {
        const minPos = [Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER];
        const maxPos = [Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER];
        for (let i = 0; i < this.vertices.length; i += 3) {
            for (let j = 0; j < 3; j++) {
                if (this.vertices[i + j] < minPos[j]) {
                    minPos[j] = this.vertices[i + j];
                }
                if (this.vertices[i + j] > maxPos[j]) {
                    maxPos[j] = this.vertices[i + j];
                }
            }
        }
        const offset = [];
        let d = 0;
        for (let j = 0; j < 3; j++) {
            d = maxPos[j] - minPos[j];
            offset.push(minPos[j] + d / 2);
        }
        this.offset = new THREE.Vector3(offset[0], offset[1], offset[2]);
    }
    asThreeMesh(color = 0xaaaaaa, metadata = null, metadataMerge = false, scale = 1) {
        if (!this.offset) {
            this.estimateOffset();
        }
        let vertices = [], faces = [];
        for (let i = 0; i < this.vertices.length; i += 3) {
            vertices.push(new THREE.Vector3(scale * (this.vertices[i] - this.offset.x), scale * (this.vertices[i + 1] - this.offset.y), scale * (this.vertices[i + 2] - this.offset.z)));
        }
        for (let i = 0; i < this.triangles.length; i += 3) {
            faces.push(new THREE.Face3(this.triangles[i], this.triangles[i + 1], this.triangles[i + 2]));
        }
        const geometry = new THREE.Geometry();
        geometry.vertices = vertices;
        geometry.faces = faces;
        geometry.computeVertexNormals();
        geometry.computeMorphNormals();
        geometry.computeFaceNormals();
        const material = new THREE.MeshLambertMaterial({
            morphTargets: true,
            flatShading: false,
            vertexColors: true,
            color: color,
            side: THREE.BackSide
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        if (metadataMerge)
            Object.assign(metadata, this.metadata);
        mesh.userData = (!metadata) ? this.metadata : metadata;
        return mesh;
    }
    toObject3D() {
        return this.asThreeMesh(undefined, undefined, undefined, -1);
    }
}
class WBMeshesObject extends WBObject {
    constructor(id = null, offset = null) {
        super(id);
        this.offset = offset;
    }
    addMesh(mesh) {
        if (mesh.state === WBOState.Error) {
            throw new Error("Can not add under error mesh.");
        }
        if (this.offset)
            mesh.offset = this.offset;
        this.meshes.push(mesh);
        this.updateState(WBOState.Ready);
    }
    setOffset(offset) {
        this.offset = offset;
        for (const mesh of this.meshes)
            mesh.offset = offset;
    }
}
class WBTextureObject extends WBObject {
    constructor(id = null) {
        super(id);
        this.type = "Texture";
    }
}
class WBTexturedMeshObject extends WBObject {
    constructor(id = null, mesh = null, texture = null) {
        super(id);
        this.mesh = mesh;
        this.texture = texture;
    }
}
class WBTexturedMeshRecipe extends WBMergeRecipe {
    constructor() {
        super("Textured Mesh", { 'WBTextureObject': 1, 'WBMeshObject': 1 });
    }
    merge(id = null, objects) {
        const ingredients = this.findIngredients(objects);
        return new WBTexturedMeshObject(id, ingredients['WBMeshObject'], ingredients['WBTextureObject']);
    }
}
export { WBMeshObject, WBMeshesObject, WBTextureObject, WBTexturedMeshObject, WBTexturedMeshRecipe };
//# sourceMappingURL=WBSurfacesObjects.js.map