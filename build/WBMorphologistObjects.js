import * as THREE from "../dependencies/three.js/build/three.module.js";
import { WBObject, WBTextReadableObject } from "./WBObject.js";
class WBMorphFoldObject extends WBObject {
    constructor(id = null) {
        super(id);
        this.type = "Fold";
        this.metadata = {};
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
}
class WBMorphLabellingObject extends WBTextReadableObject {
    constructor(id = null, nameKey = "name") {
        super(id);
        this.nomenclature = null;
        this.meshes = null;
        this.type = "Fold Labelling";
        this.nameKey = nameKey;
    }
    parseFile() {
        this.folds = [];
        const lines = String(this.fr.result).split('\n');
        let state = 'waiting';
        const header = {};
        let currentFold = new WBMorphFoldObject();
        let splitIndex = null;
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (state.localeCompare('in_header') === 0) {
                if (line.substring(0, 4).localeCompare('*END') === 0) {
                    state = 'waiting_for_node';
                }
                else {
                    header[line.substring(0, 38).trim()] = line.substring(38).trim();
                }
            }
            else {
                if (state.localeCompare('in_fold') === 0) {
                    if (line.substring(-4).localeCompare('*END') === 0) {
                        if (this.meshes) {
                            currentFold.mesh = this.meshes.meshes[i];
                        }
                        this.folds.push(currentFold);
                        state = 'waiting_for_node';
                        splitIndex = null;
                        currentFold = new WBMorphFoldObject();
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
                        const key = line.substring(0, splitIndex).trim();
                        const value = line.substring(splitIndex).trim();
                        if (this.nomenclature && key.localeCompare(this.nameKey) === 0) {
                            currentFold.label = this.nomenclature.getLabelByName(value);
                        }
                        currentFold.metadata[key] = value;
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
    setNomenclature(nomenclature) {
        this.nomenclature = nomenclature;
        for (const fold of this.folds) {
            fold.label = this.nomenclature.getLabelByName(fold.label.name);
        }
    }
    setMeshes(meshes) {
        this.meshes = meshes;
        for (let f = 0; f < meshes.meshes.length; f++) {
            this.folds[f].mesh = meshes.meshes[f];
        }
    }
    getThreeMeshes() {
        const meshes = [];
        for (const fold of this.folds) {
            meshes.push(fold.mesh.mesh(fold.label.color, fold.metadata));
        }
        return meshes;
    }
}
export { WBMorphNomenclatureObject, WBMorphLabellingObject, WBMorphFoldLabelObject, WBMorphFoldObject };
//# sourceMappingURL=WBMorphologistObjects.js.map