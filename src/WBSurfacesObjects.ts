import * as THREE from "../dependencies/three.js/build/three.js";


class WBMeshObject {
    vertices: [];
    triangles: [];
    offset: THREE.Vector3;
    metadata: {};

    constructor(vertices: [], triangles: [], offset: THREE.Vector3 = null) {
        this.offset = offset;
        this.vertices = vertices;
        this.triangles = triangles;
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

    mesh(color:number|THREE.Color = 0x777777): THREE.Mesh {
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
        mesh.userData = this.metadata;
        return mesh;
    }
}


/*
class WBTextureObject extends {
    constructor(id:string = null) {
        this.type = "Texture";
    }

    parseFile(): number {
        throw new Error("Not implemented");
    }
}*/

export { WBMeshObject/*, WBMeshesObject*/ };
