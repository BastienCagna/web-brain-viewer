import * as THREE from "../dependencies/three.js/build/three.js";
import {WBObject, WBOState} from "./WBObject.js";


class WBMeshObject extends WBObject {
    vertices: [];
    triangles: [];
    offset: THREE.Vector3;
    metadata: {};

    constructor(id:string = null, vertices: [], triangles: [], offset: THREE.Vector3 = null) {
        super(id);
        this.offset = offset;
        this.vertices = vertices;
        this.triangles = triangles;
    }

    checkState(): void {
        if((!this.vertices || !this.triangles) && this.state != WBOState.Error)
            this.updateState(WBOState.Error);
        else
            this.updateState(WBOState.Ready);
    }

    estimateOffset(pointsVect): void {
        const minPos = [Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER];
        const maxPos = [Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER];
        for (let i = 0; i < pointsVect.length; i += 3) {
            for (let j = 0; j < 3; j++) {
                if (pointsVect[i + j] < minPos[j]) {
                    minPos[j] = pointsVect[i + j];
                }
                if (pointsVect[i + j] > maxPos[j]) {
                    maxPos[j] = pointsVect[i + j];
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

    asThreeMesh(color:number|THREE.Color = 0x777777, metadata:{} = null, metadataMerge = false): THREE.Mesh {
        if(!this.offset) { this.estimateOffset(this.vertices); }

        let vertices = [];
        for (let i = 0; i < this.vertices.length; i += 3){
            vertices.push(new THREE.Vector3(
                this.vertices[i] - this.offset[0].x,
                this.vertices[i + 1] - this.offset[1].y,
                this.vertices[i + 2] - this.offset[2].z
            ));
        }

        let triangles = [];
        for (let i = 0; i < this.triangles.length; i += 3) {
            triangles.push(new THREE.Vector3(
                this.triangles[i], this.triangles[i + 1], this.triangles[i + 2]));
        }

        const geometry = new THREE.Geometry();
        for (const tri of this.triangles){
            geometry.faces.push(tri);
        }
        geometry.rotateX(Math.PI / 2);
        geometry.rotateZ(-Math.PI / 2);
        geometry.rotateY(-Math.PI / 2);
        geometry.computeMorphNormals();
        geometry.computeFaceNormals();
        geometry.computeVertexNormals();

        const material = new THREE.MeshLambertMaterial({
            //opacity: 0.95,
            //transparent: true,
            morphTargets: true,
            flatShading: false,
            vertexColors: true,
            color: color,
            side: THREE.BackSide
        });

        const mesh = new THREE.Mesh( geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        if(metadataMerge) Object.assign(metadata, this.metadata);
        mesh.userData = (!metadata) ? this.metadata : metadata;
        return mesh;
    }
}

class WBMeshesObject extends WBObject {
    meshes: WBMeshObject[];
    offset: THREE.Vector3;

    constructor(id: string = null, offset: THREE.Vector3 = null) {
        super(id);
        this.offset = offset;
    }

    addMesh(mesh: WBMeshObject): void {
        if(mesh.state === WBOState.Error) {
            throw new Error("Can not add under error mesh.");
        }
        if(this.offset) mesh.offset = this.offset;
        this.meshes.push(mesh);
        this.updateState(WBOState.Ready);
    }

    setOffset(offset: THREE.Vector3): void {
        this.offset = offset;
        for(const mesh of this.meshes)
            mesh.offset = offset;
    }
}


class WBTextureObject extends WBObject {
    values: number[];
    metadata: {};

    constructor(id:string = null) {
        super(id);
        this.type = "Texture";
    }
}

export { WBMeshObject, WBMeshesObject, WBTextureObject };
