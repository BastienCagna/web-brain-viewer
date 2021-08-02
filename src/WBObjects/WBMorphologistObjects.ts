// @ts-ignore
import * as THREE from "https://unpkg.com/three@0.126.1/build/three.module.js";
import {WBObject, WBOState, WBTextReadableObject} from "./WBObject.js";
import {WBMeshesObject, WBMeshObject} from "./WBSurfacesObjects.js";
import {WBMergeRecipe} from "./WBMergeRecipe.js";
import { WBColorMap, WBBasicColorMap} from "./WBColorMap.js";
import {min, max} from "../utils.js";
import {Vector3} from "three";

class WBMorphFoldObject extends WBObject {
    label: WBMorphFoldLabelObject;
    metadata: {};
    mesh: WBMeshObject;

    constructor(id:string = null, metadata: {} = {}) {
        super(id);
        this.type = "Fold";
        this.metadata = metadata;
    }
}

class WBMorphFoldLabelObject extends WBObject {
    name: string;
    label: number;
    color: THREE.Color;

    constructor(id:string = null) {
        super(id);
        this.type = "Fold Label";
        this.name = null;
        this.label = null;
        this.color = 0x777777;
    }
}

class WBMorphNomenclatureObject extends WBTextReadableObject {
    name: string;
    folds: WBMorphFoldLabelObject[];

    constructor(id:string = null) {
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
            } else if (line.substring(0, 4).localeCompare('name') === 0) {
                currentFold.name = line.substring(4).trim();
            } else if (line.substring(0, 5).localeCompare('color') === 0) {
                splits = line.substring(5).trim().split(' ');
                currentFold.color = new THREE.Color(parseInt(splits[0], 10) / 255,
                    parseInt(splits[1], 10) / 255, parseInt(splits[2], 10) / 255);
            } else if (line.substring(0, 5).localeCompare('label') === 0) {
                splits = line.substring(5).split(' ');
                currentFold.label = parseInt(line.substring(5).trim(), 10);
            }
        }
    }

    getLabelByName(name: string): WBMorphFoldLabelObject {
        for(const foldLabel of this.folds) {
            if(!foldLabel.name.localeCompare(name)) {
                return foldLabel;
            }
        }
        return null;
    }

    getLabelByLabel(label: number): WBMorphFoldLabelObject {
        for(const foldLabel of this.folds) {
            if(foldLabel.label && foldLabel.label === label) {
                return foldLabel;
            }
        }
        return null;
    }
}

class WBMorphFoldsInfosObject extends WBTextReadableObject {
    metadataArray: [];
    header: {};

    constructor(id:string = null) {
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
                } else {
                    this.header[line.substring(0, 38).trim()] = line.substring(38).trim();
                }
            } else {
                if (state.localeCompare('in_fold') === 0) {
                    if (line.substring(-4).localeCompare('*END') === 0) {
                        // @ts-ignore
                        this.metadataArray.push(currentInfos);
                        state = 'waiting_for_node';
                        splitIndex = null;
                        currentInfos = {};
                    } else {
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
    foldsInfos: WBMorphFoldsInfosObject;
    folds: WBMorphFoldObject[];
    labellingKey: string;
    labelKey: string;
    nomenclature: WBMorphNomenclatureObject = null;
    meshes: WBMeshesObject = null;
    brainMesh: WBMeshObject;

    constructor(id:string = null, meshes: WBMeshesObject = null, foldsInfos: WBMorphFoldsInfosObject = null,
                brainMesh: WBMeshObject = null, nomenclature: WBMorphNomenclatureObject = null,
                labelKey:string = "Tmtktri_label") {
        super(id);
        this.type = "Sulci Graph Labelling";
        this.labelKey = labelKey;
        this.labellingKey = undefined;

        if(!meshes) { throw "At least the set of folds meshes is needed."; }
        this.meshes = meshes;
        this.brainMesh = brainMesh;
        this.nomenclature = nomenclature;
        if(this.brainMesh) {
            this.brainMesh.estimateOffset();
            this.meshes.setOffset(this.brainMesh.offset);
        } else {
            let xVect, yVect, zVect
            this.meshes.setOffset('mean');
        }
        this.foldsInfos = foldsInfos;
        this.checkState();
    }

    checkState() {
        // FIXME: this method is either useless either not really implemented
        this.updateState(WBOState.Ready);
        /*if(this.folds && this.folds.length > 0)
            this.updateState(WBOState.Ready);
        else if(this.foldsInfos.state === WBOState.Ready && this.meshes.state === WBOState.Ready)
            this.updateState(WBOState.Loading);
        else
            this.updateState(WBOState.Error);*/
    }

    setFolds(labellingKey: string = "label") {
        if(['label', 'name'].indexOf(labellingKey) < 0)
            throw "Wrong labelling key. Should be 'name' or 'label'";
        this.folds = [];
        const nFolds = this.meshes.meshes.length;
        let fold: WBMorphFoldObject, label: WBMorphFoldLabelObject, item: {};
        // For each fold mesh
        for (let f = 0; f < nFolds; f++) {
            fold = new WBMorphFoldObject();
            fold.mesh = this.meshes.meshes[f];
            if(this.foldsInfos) {
                // Search for corresponding fold infos
                for (let i = 0; i < this.foldsInfos.metadataArray.length; i++) {
                    item = this.foldsInfos.metadataArray[i];
                    if ((parseInt(item[this.labelKey], 10) - 1) === f ) {

                        fold.metadata = item;
                        fold.metadata['meshFoldId'] = f;
                        fold.metadata['labelFoldId'] = i;
                        if(this.nomenclature) {
                            label = this.nomenclature.getLabelByName(item[labellingKey]);
                            if (!label) console.log("no label for ", fold);
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

    /**
     * Convert to ThreeJS 3D objects
     * @param nameKey: string
     *      If nameKey if 'label' or 'name': folds are colorized by either their labels or their names.
     * @param colorValue: string
     *      If colorValue is 'label', the color is fixed by the nomenclature and the value of the nameKey.
     *      If colorValue starts by 'meta_', metric embedded in the .arg file is used.
     *      If colorValue starts by 'data', additional data are used.
     * @param data: dict
     *      Must be defined if colorValue is "data".
     * @param cmap: WBColorMap
     *      Color map used if colorValue is not 'label'.
     */
    toObject3D(nameKey: string = "label", colorValue: string="label", data: {} = {},
               cmap: WBColorMap = new WBBasicColorMap()): THREE.Mesh[] {
        if(!this.labellingKey || this.labellingKey.localeCompare(nameKey) !== 0) {
            this.setFolds(nameKey);
        }
        const meshes = [];
        if(this.brainMesh) meshes.push(this.brainMesh.asThreeMesh(undefined, undefined, undefined, -1));
        const splitted = colorValue.split('_');
        const colorType = splitted[0];

        let vkey = undefined;
        if(colorType.localeCompare('meta') === 0) {
            vkey = splitted.slice(1).join('_');
        }

        let values: number[] = [];
        let colors: number|THREE.Color[] = [];
        for(const fold of this.folds) {
            switch (colorType) {
                case "label":
                    colors.push(!fold.label ? 0x777777: fold.label.color); break;
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
        if(colors.length === 0) {
            // @ts-ignore
            colors = cmap.colors(values);
        }

        let foldMeshesGroup = new THREE.Group();
        let fold, mesh;
        for(let f = 0; f < this.folds.length; f++) {
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
        super("Sulci Graph Labelling",
            {'Meshes': 1, 'WBMorphFoldsInfosObject': 1, 'Mesh': -1 , 'WBMorphNomenclatureObject': -1});
    }

    merge(id:string = null, objects: WBObject[]): WBMorphLabellingObject {
        const ingredients = this.findIngredients(objects);

        if(ingredients['Meshes'].constructor.name.localeCompare("WBGiftiImage")===0) {
            ingredients['Meshes'] = ingredients['Meshes'].toWBMorphMeshesObject();
        }
        if(ingredients['Mesh'] && ingredients['Mesh'].constructor.name.localeCompare("WBGiftiImage")===0) {
            ingredients['Mesh'] = ingredients['Mesh'].meshes[0];
        }
        return new WBMorphLabellingObject(
            id, ingredients['Meshes'], ingredients['WBMorphFoldsInfosObject'], ingredients['Mesh'],
            ingredients['WBMorphNomenclatureObject']);
    }
}


export { WBMorphNomenclatureObject, WBMorphFoldsInfosObject, WBMorphFoldLabelObject, WBMorphFoldObject,
         WBMorphLabellingObject, WBMorphLabellingRecipe };
