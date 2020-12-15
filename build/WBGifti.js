import { WBNiftiDataType, WBNiftiIntent } from "./WBNifti.js";
import { b64ToFloat32Array, b64ToInt32Array } from "./convert.js";
import { WBTextReadableObject } from "./WBObject.js";
import { WBMeshesObject, WBMeshObject } from "./WBSurfacesObjects.js";
var WBArrayIndenxingOrder;
(function (WBArrayIndenxingOrder) {
    WBArrayIndenxingOrder[WBArrayIndenxingOrder["RowMajorOrder"] = 0] = "RowMajorOrder";
    WBArrayIndenxingOrder[WBArrayIndenxingOrder["ColumnMajorOrder"] = 1] = "ColumnMajorOrder";
})(WBArrayIndenxingOrder || (WBArrayIndenxingOrder = {}));
var WBEndian;
(function (WBEndian) {
    WBEndian[WBEndian["LittleEndian"] = 0] = "LittleEndian";
    WBEndian[WBEndian["BigEndian"] = 1] = "BigEndian";
})(WBEndian || (WBEndian = {}));
class WBGiftiDataArray {
    constructor(data = null, intent = WBNiftiIntent.NIFTI_INTENT_NONE, dtype = WBNiftiDataType.NIFTI_TYPE_UNKNOWN) {
        this.shape = [];
        this.data = data;
        this.intent = intent;
        this.dtype = dtype;
    }
    parseDom(element) {
        this.intent = WBNiftiIntent[element.attributes.Intent.value];
        this.dtype = WBNiftiDataType[element.attributes.DataType.value];
        this.indexingOrder = WBArrayIndenxingOrder[element.attributes.ArrayIndexingOrder.value];
        this.encoding = element.attributes.Encoding.value;
        this.endian = WBEndian[element.attributes.Endian.value];
        this.extFileName = element.attributes.ExternalFileName.value;
        this.extOffset = element.attributes.ExternalFileOffset.value;
        const D = parseInt(element.attributes.Dimensionality.value, 10);
        this.shape = [];
        for (let d = 0; d < D; d++) {
            this.shape.push(parseInt(element.attributes['Dim' + d].value, 10));
        }
        if (this.indexingOrder === WBArrayIndenxingOrder.ColumnMajorOrder) {
            throw new Error("Unhandled indexing order");
        }
        if (this.extFileName) {
            console.log("/!\\ Unhandled external files");
        }
        if (this.encoding.localeCompare("Base64Binary")) {
            throw new Error("Unhandled encoding");
        }
        const binData = atob(element.children[1].innerHTML);
        switch (this.dtype) {
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
    constructor(id = null, file = null, commonOffset = null) {
        super(id);
        this.darrays = [];
        this.metadata = {};
        this.labeltable = [];
        this.meshes = [];
        this.textures = [];
        this.nameKey = "name";
        this.commonOffset = commonOffset;
        if (file) {
            this.loadFile(file);
        }
    }
    loadFile(file) {
        this.fr.readAsText(file);
    }
    parseFile() {
        this.parseXML(this.fr.result.toString());
    }
    parseXML(xml) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(xml, 'application/xml');
        this.parseDom(doc.firstElementChild);
    }
    parseDom(element) {
        this.version = element.attributes.Version.value;
        this.numberOfDataArrays = parseInt(element.attributes.NumberOfDataArrays.value, 10);
        if (this.numberOfDataArrays !== element.children.length - 2) {
            console.log("/!\\ Gifti file could be invalid.");
        }
        for (const child of element.children) {
            if (child.nodeName.localeCompare("DataArray") == 0) {
                const darray = new WBGiftiDataArray();
                darray.parseDom(child);
                this.darrays.push(darray);
            }
        }
        this.setMeshes();
        if (this.meshes.length > 0) {
            if (this.textures.length > 0) {
                this.type = "Textures and Meshes";
            }
            else {
                this.type = (this.meshes.length > 1) ? "Meshes" : "Mesh";
            }
        }
        else if (this.textures.length > 0) {
            this.type = (this.textures.length > 1) ? "Textures" : "Texture";
        }
        else {
            this.type = "Unknown surface object";
        }
    }
    setMeshes() {
        let pointset = null, triangles = null;
        for (let d = 0; d < this.darrays.length; d++) {
            pointset = null;
            triangles = null;
            if (this.darrays[d].intent == WBNiftiIntent.NIFTI_INTENT_POINTSET && this.darrays[d + 1].intent == WBNiftiIntent.NIFTI_INTENT_TRIANGLE) {
                pointset = this.darrays[d];
                triangles = this.darrays[d + 1];
            }
            else if (this.darrays[d + 1].intent == WBNiftiIntent.NIFTI_INTENT_POINTSET && this.darrays[d].intent == WBNiftiIntent.NIFTI_INTENT_TRIANGLE) {
                pointset = this.darrays[d];
                triangles = this.darrays[d + 1];
            }
            if (triangles && pointset) {
                let id = null;
                if (this.darrays[d].metadata && this.darrays[d].metadata[this.nameKey]) {
                    id = this.darrays[d].metadata[this.nameKey];
                }
                else if (this.darrays[d + 1].metadata && this.darrays[d + 1].metadata[this.nameKey]) {
                    id = this.darrays[d + 1].metadata[this.nameKey];
                }
                else if (this.darrays.length / 2 === 1) {
                    id = this.id;
                }
                else {
                    id = this.id + "(" + (d + 1) + "/" + this.darrays.length / 2 + ")";
                }
                const mesh = new WBMeshObject(id, pointset.data, triangles.data, this.commonOffset);
                this.meshes.push(mesh);
                d += 1;
            }
        }
    }
    setCommonOffset(commonOffset) {
        this.commonOffset = commonOffset;
        for (const mesh of this.meshes) {
            mesh.offset = commonOffset;
        }
    }
    toWBMorphMeshesObject() {
        const newObj = new WBMeshesObject(null, this.commonOffset);
        newObj.meshes = this.meshes;
        newObj.state = this.state;
        return newObj;
    }
    toObject3D() {
        let meshes = [];
        for (const mesh of this.meshes) {
            meshes.push(mesh.toObject3D());
        }
        return meshes;
    }
}
export { WBGiftiImage };
//# sourceMappingURL=WBGifti.js.map