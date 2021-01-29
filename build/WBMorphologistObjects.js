import * as THREE from "../dependencies/three.js/build/three.module.js";
import { WBObject, WBOState, WBTextReadableObject } from "./WBObject.js";
import { WBMergeRecipe } from "./WBMergeRecipe.js";
class WBMorphFoldObject extends WBObject {
    constructor(id = null, metadata = {}) {
        super(id);
        this.type = "Fold";
        this.metadata = metadata;
    }
}
class WBMorphFoldLabelObject extends WBObject {
    constructor(id = null) {
        super(id);
        this.type = "Fold Label";
        this.name = null;
        this.label = null;
        this.color = 0x777777;
    }
}
class WBMorphNomenclatureObject extends WBTextReadableObject {
    constructor(id = null) {
        super(id);
        this.type = "Folding Nomenclature";
    }
    parseFile() {
        const lines = String(this.fr.result).split('\n');
        let splits = [];
        let currentFold = null;
        this.folds = [];
        for (const line of lines) {
            if (line.substring(0, 12).localeCompare('graph_syntax') === 0) {
                this.name = line.substring(13).trim();
            }
            if (line.trim().localeCompare('*BEGIN TREE fold_name') === 0) {
                if (currentFold !== null) {
                    this.folds.push(currentFold);
                }
                currentFold = new WBMorphFoldLabelObject();
            }
            else if (line.substring(0, 4).localeCompare('name') === 0) {
                currentFold.name = line.substring(4).trim();
            }
            else if (line.substring(0, 5).localeCompare('color') === 0) {
                splits = line.substring(5).trim().split(' ');
                currentFold.color = new THREE.Color(parseInt(splits[0], 10) / 255, parseInt(splits[1], 10) / 255, parseInt(splits[2], 10) / 255);
            }
            else if (line.substring(0, 5).localeCompare('label') === 0) {
                splits = line.substring(5).split(' ');
                currentFold.label = parseInt(line.substring(5).trim(), 10);
            }
        }
    }
    getLabelByName(name) {
        for (const foldLabel of this.folds) {
            if (!foldLabel.name.localeCompare(name)) {
                return foldLabel;
            }
        }
        return null;
    }
    getLabelByLabel(label) {
        for (const foldLabel of this.folds) {
            if (!foldLabel.label.localeCompare(label)) {
                return foldLabel;
            }
        }
        return null;
    }
}
class WBMorphFoldsInfosObject extends WBTextReadableObject {
    constructor(id = null) {
        super(id);
        this.type = "Fold Labelling";
        this.metadataArray = [];
    }
    parseFile() {
        const lines = String(this.fr.result).split('\n');
        this.header = {};
        this.metadataArray = [];
        let state = 'waiting';
        let currentInfos = {};
        let splitIndex = null;
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (state.localeCompare('in_header') === 0) {
                if (line.substring(0, 4).localeCompare('*END') === 0) {
                    state = 'waiting_for_node';
                }
                else {
                    this.header[line.substring(0, 38).trim()] = line.substring(38).trim();
                }
            }
            else {
                if (state.localeCompare('in_fold') === 0) {
                    if (line.substring(-4).localeCompare('*END') === 0) {
                        this.metadataArray.push(currentInfos);
                        state = 'waiting_for_node';
                        splitIndex = null;
                        currentInfos = {};
                    }
                    else {
                        if (!splitIndex) {
                            splitIndex = 19;
                        }
                        let c = line[splitIndex];
                        while (c.localeCompare(' ') === 0) {
                            splitIndex++;
                            c = line[splitIndex];
                        }
                        currentInfos[line.substring(0, splitIndex).trim()] = line.substring(splitIndex).trim();
                    }
                }
            }
            if (line.substring(0, 28).localeCompare('*BEGIN GRAPH CorticalFoldArg') === 0) {
                state = 'in_header';
            }
            if (line.substring(0, 16).localeCompare('*BEGIN NODE fold') === 0) {
                state = 'in_fold';
            }
        }
    }
}
class WBMorphLabellingObject extends WBObject {
    constructor(id = null, nomenclature = null, brainMesh = null, foldsInfos = null, meshes = null, nameKey = "name", labelKey = "Tmtktri_label") {
        super(id);
        this.nomenclature = null;
        this.meshes = null;
        this.type = "Sulci Graph Labelling";
        this.nameKey = nameKey;
        this.labelKey = labelKey;
        this.nomenclature = nomenclature;
        this.brainMesh = brainMesh;
        this.meshes = meshes;
        this.brainMesh.estimateOffset();
        this.meshes.setOffset(this.brainMesh.offset);
        this.foldsInfos = foldsInfos;
        this.checkState();
        if (this.state == WBOState.Loading) {
            this.folds = [];
            const nFolds = this.meshes.meshes.length;
            let fold, label, item;
            for (let f = 0; f < nFolds; f++) {
                fold = new WBMorphFoldObject();
                fold.mesh = this.meshes.meshes[f];
                for (let i = 0; i < this.foldsInfos.metadataArray.length; i++) {
                    item = this.foldsInfos.metadataArray[i];
                    if ((parseInt(item[this.labelKey], 10) - 1) === f) {
                        label = (this.nameKey === "name") ? this.nomenclature.getLabelByName(item["name"]) : this.nomenclature.getLabelByLabel(item["label"]);
                        fold.metadata = item;
                        fold.metadata['meshFoldId'] = f;
                        fold.metadata['labelFoldId'] = i;
                        fold.metadata['color'] = [label.color.r, label.color.g, label.color.b];
                        fold.label = label;
                        if (!label)
                            console.log("no label for ", fold);
                        break;
                    }
                }
                this.folds.push(fold);
            }
            this.checkState();
        }
    }
    checkState() {
        if (this.folds && this.folds.length > 0)
            this.updateState(WBOState.Ready);
        else if (this.foldsInfos.state === WBOState.Ready && this.nomenclature.state === WBOState.Ready &&
            this.meshes.state === WBOState.Ready)
            this.updateState(WBOState.Loading);
        else
            this.updateState(WBOState.Error);
    }
    toObject3D() {
        const meshes = [this.brainMesh.asThreeMesh(undefined, undefined, undefined, -1)];
        let foldMeshesGroup = new THREE.Group();
        for (const fold of this.folds) {
            let mesh;
            if (!fold.label)
                mesh = fold.mesh.asThreeMesh(0x333333, fold.metadata, true, -1);
            else
                mesh = fold.mesh.asThreeMesh(fold.label.color, fold.metadata, true, -1);
            mesh.name = fold.label ? fold.label.name : fold.id;
            foldMeshesGroup.add(mesh);
        }
        foldMeshesGroup.name = this.id;
        meshes.push(foldMeshesGroup);
        return meshes;
    }
}
class WBMorphLabellingRecipe extends WBMergeRecipe {
    constructor() {
        super("Sulci Graph Labelling", { 'WBMorphNomenclatureObject': 1, 'Meshes': 1, 'Mesh': 1, 'WBMorphFoldsInfosObject': 1 });
    }
    merge(id = null, objects) {
        const ingredients = this.findIngredients(objects);
        if (ingredients['Meshes'].constructor.name.localeCompare("WBGiftiImage") === 0) {
            ingredients['Meshes'] = ingredients['Meshes'].toWBMorphMeshesObject();
        }
        if (ingredients['Mesh'].constructor.name.localeCompare("WBGiftiImage") === 0) {
            ingredients['Mesh'] = ingredients['Mesh'].meshes[0];
        }
        return new WBMorphLabellingObject(id, ingredients['WBMorphNomenclatureObject'], ingredients['Mesh'], ingredients['WBMorphFoldsInfosObject'], ingredients['Meshes']);
    }
}
export { WBMorphNomenclatureObject, WBMorphFoldsInfosObject, WBMorphFoldLabelObject, WBMorphFoldObject, WBMorphLabellingObject, WBMorphLabellingRecipe };
//# sourceMappingURL=WBMorphologistObjects.js.map