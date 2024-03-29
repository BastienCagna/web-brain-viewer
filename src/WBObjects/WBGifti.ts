import * as THREE from 'three'; //"https://unpkg.com/three@0.126.1/build/three.module";
// import {Gunzip} from "fflate";
//import { inflate }  from 'zlib';

import {WBNiftiDataType, WBNiftiIntent} from "./WBNifti";
import {b64ToFloat32Array, b64ToInt32Array} from "../convert";
import {WBTextReadableObject} from "./WBObject";
import {WBMeshesObject, WBMeshObject, WBTextureObject} from "./WBSurfacesObjects";

// TODO: use gifti parser

enum WBArrayIndenxingOrder {
    RowMajorOrder,
    ColumnMajorOrder
}

enum WBEndian {
    LittleEndian,
    BigEndian
}

// src: https://nipy.org/nibabel/reference/nibabel.gifti.html#nibabel.gifti.gifti.GiftiDataArray
class WBGiftiDataArray {
    intent: WBNiftiIntent;
    dtype: WBNiftiDataType;
    encoding;
    endian: WBEndian;
    coordsys;
    indexingOrder: WBArrayIndenxingOrder;
    extFileName;
    extOffset;
    shape = [];
    data;
    meta: {};

    constructor(data: [] = null,
                intent: WBNiftiIntent = WBNiftiIntent.NIFTI_INTENT_NONE,
                dtype: WBNiftiDataType = WBNiftiDataType.NIFTI_TYPE_UNKNOWN) {
        this.data = data;
        this.intent = intent;
        this.dtype = dtype;
    }

    parseDom(element): boolean {
        this.intent = (<any>WBNiftiIntent)[element.attributes.Intent.value];
        this.dtype = (<any>WBNiftiDataType)[element.attributes.DataType.value];
        this.indexingOrder = (<any>WBArrayIndenxingOrder)[element.attributes.ArrayIndexingOrder.value];
        this.encoding = element.attributes.Encoding.value;
        this.endian = (<any>WBEndian)[element.attributes.Endian.value];
        this.extFileName = element.attributes.ExternalFileName.value;
        this.extOffset = element.attributes.ExternalFileOffset.value;

        const D = parseInt(element.attributes.Dimensionality.value, 10);
        this.shape = [];
        for(let d = 0; d < D; d++) {
            this.shape.push(parseInt(element.attributes['Dim' + d].value, 10));
        }

        if(this.indexingOrder === WBArrayIndenxingOrder.ColumnMajorOrder) {
            throw new Error("Unhandled indexing order");
        }
        if(this.extFileName) {
            console.log("/!\\ Unhandled external files");
        }

        let gzip = false;
        let binData = element.children[element.children.length-1].innerHTML;
        if(this.encoding.localeCompare("GZipBase64Binary") === 0) {
            gzip = true;
        } else if(this.encoding.localeCompare("Base64Binary")) {
            throw new Error("Unhandled encoding " + this.encoding);
        }

        // Parse data
        // TODO: update next line with Buffer.from
        binData = atob(binData);

        if(gzip) {
            throw Error("Not implemented GZip decompression");
            /*const d = inflate(binData, (binData) => {console.log(binData);});
            //binData, (binData) => {console.log(binData);});
            console.log(d);
            const rawLength = dt.length;
            let array = new Uint8Array(new ArrayBuffer(rawLength));
            for(let i = 0; i < rawLength; i++) {
                array[i] = dt.charCodeAt(i);
            }
            array = Uint8Array.from(array);
            const g = new Gunzip((chunk) => {console.log(chunk)});
            g.push(binData, true);
            console.log(binData);*/
        }

        switch(this.dtype) {
            case WBNiftiDataType.NIFTI_TYPE_FLOAT32:
                this.data = b64ToFloat32Array(binData);
                break;
            case WBNiftiDataType.NIFTI_TYPE_INT32:
                this.data = b64ToInt32Array(binData);
                break;
            default:
                throw new Error("Unhandled data type " + WBNiftiDataType[this.dtype]);
        }
        return true;
    }
}


class WBGiftiImage extends WBTextReadableObject {
    version: string;
    numberOfDataArrays: number;
    darrays = [];
    metadata = {};
    labeltable = [];
    meshes: WBMeshObject[] = [];
    textures: WBTextureObject[] = [];
    nameKey: string = "name";

    constructor(id:string = null, file: File|Blob = null) {
        super(id);
        if(file) {
            this.loadFile(file);
        }
    }

    loadFile(file: File|Blob): void {
         this.fr.readAsText(file);
     }

    parseFile() {
         this.parseXML(this.fr.result.toString());
     }

    parseXML(xml: string): void {
         const parser = new DOMParser();
         const doc = parser.parseFromString(xml, 'application/xml');
         this.parseDom(doc.firstElementChild);
     }

    parseDom(element): void {
         this.version = element.attributes.Version.value;
         this.numberOfDataArrays = parseInt(element.attributes.NumberOfDataArrays.value, 10);
         if(this.numberOfDataArrays !== element.children.length-2) {
             console.log("/!\\ Gifti file could be invalid.");
         }
         //this.metadata = element.children[0];
         //this.labeltable = element.children[1];
         for(const child of element.children) {
             if(child.nodeName.localeCompare("DataArray")==0) {
                 const darray = new WBGiftiDataArray();
                 darray.parseDom(child);
                 this.darrays.push(darray);
             }
         }

         this.setMeshes();
         //this.setSurfaces();

        if(this.meshes.length > 0) {
            if(this.textures.length > 0) {
                this.type = "Textures and Meshes";
            } else {
                this.type = (this.meshes.length > 1) ? "Meshes" : "Mesh";
            }
        } else if(this.textures.length > 0) {
            this.type = (this.textures.length > 1) ? "Textures" : "Texture";
        } else {
            this.type = "Unknown surface object";
        }
     }

    setMeshes(): void {
        let pointset = null, triangles = null;
        for(let d = 0; d < this.darrays.length; d++) {
            pointset = null;
            triangles = null;
            if(this.darrays[d].intent == WBNiftiIntent.NIFTI_INTENT_POINTSET && this.darrays[d+1].intent == WBNiftiIntent.NIFTI_INTENT_TRIANGLE) {
                pointset = this.darrays[d];
                triangles = this.darrays[d+1];
            }
            else if (this.darrays[d+1].intent == WBNiftiIntent.NIFTI_INTENT_POINTSET && this.darrays[d].intent == WBNiftiIntent.NIFTI_INTENT_TRIANGLE) {
                pointset = this.darrays[d];
                triangles = this.darrays[d+1];
            }
            if(triangles && pointset){
                let id = null;
                if(this.darrays[d].metadata && this.darrays[d].metadata[this.nameKey]) {
                    id = this.darrays[d].metadata[this.nameKey];
                } else if(this.darrays[d+1].metadata && this.darrays[d+1].metadata[this.nameKey]) {
                    id = this.darrays[d+1].metadata[this.nameKey];
                } else if(this.darrays.length/2 === 1) {
                    id = this.id;
                } else {
                    id = this.id + "(" + (d+1) + "/" + this.darrays.length/2 + ")";
                }
                const mesh = new WBMeshObject(id, pointset.data, triangles.data);
                this.meshes.push(mesh);
                d += 1;
            }
        }
        // TODO: remove darrays that have been duplicated to create meshes
    }

    toWBMorphMeshesObject(): WBMeshesObject {
        const newObj = new WBMeshesObject(null);
        newObj.setMeshes(this.meshes);
        newObj.state = this.state;
        return newObj;
    }

    toObject3D(): THREE.Object3D[] {
        let meshes = [];
        for(const mesh of this.meshes) {
            meshes.push(mesh.toObject3D());
        }
        return meshes;
    }
}

export { WBGiftiImage, WBGiftiDataArray };
