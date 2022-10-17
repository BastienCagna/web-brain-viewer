import * as THREE from 'three';
import { WBObject, WBOState, WBTextReadableObject } from "./WBObject";
import { WBMergeRecipe } from "./WBMergeRecipe";
import { WBBasicColorMap } from "./WBColorMap";
class WBMorphFoldObject extends WBObject {
    constructor(id = null, metadata = {}) {
        super(id);
        this.type = "Fold";
        this.metadata = metadata;
    }
}
class WBMorphFoldLabelObject extends WBObject {
    constructor(id = null, name = null, label = null, color = new THREE.Color(0x777777)) {
        super(id);
        this.type = "Fold Label";
        this.name = name;
        this.label = label;
        this.color = color;
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
        console.log('hie:', this);
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
            if (foldLabel.label && foldLabel.label === label) {
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
    constructor(id = null, meshes = null, foldsInfos = null, brainMesh = null, nomenclature = null, labelKey = "Tmtktri_label") {
        super(id);
        this.nomenclature = null;
        this.meshes = null;
        this.type = "Sulci Graph Labelling";
        this.labelKey = labelKey;
        this.labellingKey = undefined;
        if (!meshes) {
            throw "At least the set of folds meshes is needed.";
        }
        this.meshes = meshes;
        this.brainMesh = brainMesh;
        this.nomenclature = nomenclature;
        if (this.brainMesh) {
            this.brainMesh.estimateOffset();
            this.meshes.setOffset(this.brainMesh.offset);
        }
        else {
            let xVect, yVect, zVect;
            this.meshes.setOffset('mean');
        }
        this.foldsInfos = foldsInfos;
        this.checkState();
    }
    checkState() {
        this.updateState(WBOState.Ready);
    }
    setFolds(labellingKey = "label") {
        if (['label', 'name'].indexOf(labellingKey) < 0)
            throw "Wrong labelling key. Should be 'name' or 'label'";
        this.folds = [];
        const nFolds = this.meshes.meshes.length;
        let fold, label, item;
        for (let f = 0; f < nFolds; f++) {
            fold = new WBMorphFoldObject();
            fold.mesh = this.meshes.meshes[f];
            if (this.foldsInfos) {
                for (let i = 0; i < this.foldsInfos.metadataArray.length; i++) {
                    item = this.foldsInfos.metadataArray[i];
                    if ((parseInt(item[this.labelKey], 10) - 1) === f) {
                        fold.metadata = item;
                        fold.metadata['meshFoldId'] = f;
                        fold.metadata['labelFoldId'] = i;
                        if (this.nomenclature) {
                            label = this.nomenclature.getLabelByName(item[labellingKey]);
                            if (!label) {
                                console.log("no label for ", item['name'], " in hierarchy file.");
                                label = new WBMorphFoldLabelObject(null, item['name']);
                            }
                            fold.metadata['color'] = [label.color.r, label.color.g, label.color.b];
                            fold.label = label;
                        }
                        break;
                    }
                }
            }
            this.folds.push(fold);
        }
        this.labellingKey = labellingKey;
    }
    toObject3D(nameKey = "label", colorValue = "label", data = {}, cmap = new WBBasicColorMap()) {
        if (!this.labellingKey || this.labellingKey.localeCompare(nameKey) !== 0) {
            this.setFolds(nameKey);
        }
        const meshes = [];
        if (this.brainMesh)
            meshes.push(this.brainMesh.asThreeMesh(undefined, undefined, undefined, -1));
        const splitted = colorValue.split('_');
        const colorType = splitted[0];
        let vkey = undefined;
        if (colorType.localeCompare('meta') === 0) {
            vkey = splitted.slice(1).join('_');
        }
        let values = [];
        let colors = [];
        for (const fold of this.folds) {
            switch (colorType) {
                case "label":
                    colors.push(!fold.label ? new THREE.Color(0x777777) : fold.label.color);
                    break;
                case "data":
                    values.push(data[fold.metadata['index']]);
                    break;
                case "meta":
                    values.push(Math.log(parseFloat(fold.metadata[vkey])));
                    break;
                default:
                    throw 'Unrecognized colorValue "' + colorType + '".';
            }
        }
        if (colors.length === 0) {
            colors = cmap.colors(values);
        }
        let foldMeshesGroup = new THREE.Group();
        let fold, mesh;
        for (let f = 0; f < this.folds.length; f++) {
            fold = this.folds[f];
            mesh = fold.mesh.asThreeMesh(colors[f], fold.metadata, true, -1);
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
        super("Sulci Graph Labelling", { 'Meshes': 1, 'WBMorphFoldsInfosObject': 1, 'Mesh': -1, 'WBMorphNomenclatureObject': -1 });
    }
    merge(id = null, objects) {
        const ingredients = this.findIngredients(objects);
        if (ingredients['Meshes'].constructor.name.localeCompare("WBGiftiImage") === 0) {
            ingredients['Meshes'] = ingredients['Meshes'].toWBMorphMeshesObject();
        }
        if (ingredients['Mesh'] && ingredients['Mesh'].constructor.name.localeCompare("WBGiftiImage") === 0) {
            ingredients['Mesh'] = ingredients['Mesh'].meshes[0];
        }
        return new WBMorphLabellingObject(id, ingredients['Meshes'], ingredients['WBMorphFoldsInfosObject'], ingredients['Mesh'], ingredients['WBMorphNomenclatureObject']);
    }
}
export { WBMorphNomenclatureObject, WBMorphFoldsInfosObject, WBMorphFoldLabelObject, WBMorphFoldObject, WBMorphLabellingObject, WBMorphLabellingRecipe };
//# sourceMappingURL=WBMorphologistObjects.js.map