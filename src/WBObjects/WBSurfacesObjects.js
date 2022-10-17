import * as THREE from 'three';
import { WBObject, WBOState } from "./WBObject";
import { WBMergeRecipe } from "./WBMergeRecipe";
class WBMeshObject extends WBObject {
    constructor(id = null, vertices, triangles, offset = 'mean') {
        super(id);
        this.vertices = vertices;
        this.triangles = triangles;
        this.setOffset(offset);
        this.metadata = {};
    }
    checkState() {
        if ((!this.vertices || !this.triangles) && this.state != WBOState.Error)
            this.updateState(WBOState.Error);
        else
            this.updateState(WBOState.Ready);
    }
    setOffset(offset = 'mean') {
        this.offset = (offset instanceof THREE.Vector3) ? offset : null;
        this.offsetType = (offset instanceof THREE.Vector3) ? 'fixed' : (!offset) ? 'zero' : String(offset);
    }
    estimateOffset() {
        switch (this.offsetType) {
            case 'mean': break;
            case 'zero':
                this.offset = new THREE.Vector3(0, 0, 0);
                return;
            case 'fixed': return;
            default: return;
        }
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
        if (!this.offset || this.offset instanceof String) {
            this.estimateOffset();
        }
        const vertices = [];
        for (let i = 0; i < this.vertices.length; i += 3) {
            vertices.push(scale * (this.vertices[i] - this.offset.x));
            vertices.push(scale * (this.vertices[i + 1] - this.offset.y));
            vertices.push(scale * (this.vertices[i + 2] - this.offset.z));
        }
        const geometry = new THREE.BufferGeometry();
        geometry.setIndex(Array.from(this.triangles));
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.computeVertexNormals();
        geometry.computeBoundingSphere();
        const material = new THREE.MeshLambertMaterial({
            opacity: 1,
            transparent: true,
            color: color,
            side: THREE.DoubleSide,
            blending: THREE.NormalBlending,
            shadowSide: THREE.DoubleSide
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.name = this.id;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        if (metadataMerge)
            metadata = Object.assign({}, metadata, this.metadata);
        mesh.userData = (!metadata) ? this.metadata : metadata;
        return mesh;
    }
    toObject3D() {
        return this.asThreeMesh(undefined, undefined, undefined, -1);
    }
}
class WBMeshesObject extends WBObject {
    constructor(id = null, offset = 'mean') {
        super(id);
        this.meshes = [];
        this.setOffset(offset);
    }
    addMesh(mesh) {
        if (mesh.state === WBOState.Error) {
            throw new Error("Can not add under error mesh.");
        }
        this.meshes.push(mesh);
        this.updateOffsets();
        this.updateState(WBOState.Ready);
    }
    setMeshes(meshes) {
        this.meshes = meshes;
        this.updateOffsets();
    }
    setOffset(offset = 'mean') {
        this.offset = (offset instanceof THREE.Vector3) ? offset : null;
        this.offsetType = (offset instanceof THREE.Vector3) ? 'fixed' : (!offset) ? 'zero' : String(offset);
        this.updateOffsets();
    }
    updateOffsets() {
        let offset;
        switch (this.offsetType) {
            case 'mean':
                const n = this.meshes.length;
                let sumX = 0, sumY = 0, sumZ = 0;
                for (const m of this.meshes) {
                    m.setOffset('mean');
                    m.estimateOffset();
                    sumX += m.offset.x;
                    sumY += m.offset.y;
                    sumZ += m.offset.z;
                }
                offset = new THREE.Vector3(sumX / n, sumY / n, sumZ / n);
                break;
            case 'fixed':
                offset = this.offset;
                break;
            case 'zero':
                offset = 'zero';
                break;
            default:
                offset = 'zero';
                break;
        }
        for (const mesh of this.meshes) {
            mesh.setOffset(offset);
        }
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