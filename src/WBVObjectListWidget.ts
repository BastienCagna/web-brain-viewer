import {WBObject, WBOState, WBTextReadableObject} from "./WBObject.js";
import {WBMorphFoldsInfosObject, WBMorphLabellingRecipe, WBMorphNomenclatureObject} from "./WBMorphologistObjects.js";
import WBVSectionWidget from "./WBVSectionWidget.js";
import {WBVWidget} from "./WBVWidget.js";
import {WBGiftiImage} from "./WBGifti.js";
import {WBMergeRecipe} from "./WBMergeRecipe.js";
import {WBTexturedMeshRecipe} from "./WBSurfacesObjects.js";


enum WBVOType {
    WBVODefault,
    WBVOTr,
    WBVOLi
}

class WBVObjectWidget extends WBVWidget {
    object: WBObject = null;
    type: WBVOType;

    constructor(parentId: string = null,  id: string = null, object: WBObject = null,
                type: WBVOType = WBVOType.WBVODefault) {
        super(parentId, id);
        this.object = object;
        this.type = type;
    }

    html(): string {
        let stateHtml;
        switch(this.object.state) {
            case WBOState.Loading: stateHtml = '<div class="spinner-border spinner-border-sm"> </div>'; break;
            case WBOState.Ready: stateHtml = '<div class="wb-badge-sm bg-success"> </div>'; break;
            case WBOState.Used: stateHtml = '<div class="wb-badge-sm bg-primary"> </div>'; break;
            case WBOState.Error: stateHtml = '<div class="wb-badge-sm bg-danger"> </div>'; break;
            case WBOState.None:
            default: stateHtml = '<div class="wb-badge-sm bg-secondary"></div>';
                break;
        }

        switch (this.type) {
            case WBVOType.WBVOTr: return '<tr class="wbv-object-item" id="' + this.id + '"><td>' + stateHtml + "</td><td>" + this.object.id + "</td><td>" + this.object.type + "</td></tr>";
            case WBVOType.WBVOLi: return '<li class="wbv-object-item" id="' + this.id + '"><p>' + this.object.id + ', ' + this.object.state + '(' + this.object.type + ')</p></li>';
            case WBVOType.WBVODefault:
            default: return this.object.id + ", " + this.object.state + "(" + this.object.type + ")";
        }
    }
}

class WBVTextReadableObjectWidget extends WBVObjectWidget {
    selected: boolean;

    constructor(parentId: string = null, id: string = null, file: File = null,
                fid: string = null, type: WBVOType = WBVOType.WBVODefault) {
        super(parentId, id, null, type);
        this.selected = false;
        if(file) this.object = this.loadFile(file, fid);
    }

    loadFile(file:File, fid:string = null): WBTextReadableObject {
        const extension = file.name.split('.').slice(-1)[0];

        let f = null;
        switch (extension) {
            case "gii": f = new WBGiftiImage(fid); break;
            case "arg": f = new WBMorphFoldsInfosObject(fid); break;
            case "hie": f = new WBMorphNomenclatureObject(fid); break;
            default: 
                console.log("/!\\ Undefined WBFile class for this type.");
                return null;
        }
        f.loadFile(file);
        f.onStateChange = (function () { this.update(); }).bind(this);
        return f;
    }
}

class WBVObjectListWidget extends WBVSectionWidget {
    items: WBVObjectWidget[];
    counts: {};
    mergeRecipes: WBMergeRecipe[];

    constructor(parentId: string = null) {
        super(parentId, 'Objects');
        this.items = [];
        this.counts = {};

        this.mergeRecipes = [
            new WBTexturedMeshRecipe(), new WBMorphLabellingRecipe()
        ];

        $(document).on('change', '#wbv_add_file', function(event) {
            for(const file of event.target.files) {
                const newItem = new WBVTextReadableObjectWidget(
                    this.id + "_list", null, file, this.checkName(file.name), WBVOType.WBVOTr);
                if(newItem.object)
                    this.items.push(newItem);
            }
        }.bind(this));

        const that = this;
        $(document).on('click', '.wbv-object-item', function() {
            if($(this).attr('selected')) {
                $(this).removeAttr('selected');
            } else {
                $(this).attr('selected', 'selected');
            }

            const nSel = $(".wbv-object-item[selected]").length;
            let validRecipes = [];
            if(nSel > 1) {
                const objects = that.selectedObjects();
                for (const recipe of that.mergeRecipes) {
                    if (recipe.findIngredients(objects)) {
                        validRecipes.push(recipe);
                    }
                }
            }
            if(validRecipes.length > 0) {
                $("#wbv_merge_objects").removeAttr("disabled");
                let options = '<option selected value="-1">Merge to...</option>';
                for(const recipe of validRecipes) {
                    options += '<option value="' + recipe.id + '">' + recipe.name + '</option>';
                }
                $("#wbv_merge_objects").html(options);
            }
            else
                $("#wbv_merge_objects").attr("disabled", "disabled");

            if(nSel > 0)
                $("#wbv_add_to_view").removeAttr("disabled");
            else
                $("#wbv_add_to_view").attr("disabled");
        })

        $(document).on('change', '#wbv_merge_objects', function() {
            if($(this).val() !== -1) {
                for(const recipe of that.mergeRecipes) {
                    if(recipe.id === $(this).val()) {
                        const name = that.checkName("Fusion");
                        const newObj = recipe.merge(name, that.selectedObjects());
                        if(!newObj) {
                            throw new Error("Merging failed");
                        }
                        const widget = new WBVObjectWidget(that.id + "_list", null, newObj, WBVOType.WBVOTr);
                        that.items.push(widget);
                        that.update();
                        break;
                    }
                }
            }
        });
    }

    checkName(name: string): string {
        let fid;
        if(this.counts[name] === undefined) {
            fid = name;
            this.counts[name] = 1;
        } else {
            fid = name + "(" + this.counts[name] + ")";
            this.counts[name] += 1;
        }
        return fid;
    }

    selectedObjects(): WBObject[] {
        let objects = [];
        for(const el of $(".wbv-object-item[selected]")) {
            for(const item of this.items) {
                if(item.id === el.id) {
                    objects.push(item.object);
                    break;
                }
            }
        }
        return objects;
    }

    bodyHtml(): string {
        let html = '<table><thead><tr><th></th></th><th>Name</th><th>Type</th></tr></thead><tbody id="' + this.id + '_list">';
        html += '</tbody></table>';
        html += '<input type="file" class="phantom" id="wbv_add_file" name="wbv_add_file" multiple="multiple"/>';
        html += '<input type="button" class="button" value="Open files" onclick="document.getElementById(\'wbv_add_file\').click();">';
        html += '<input type="button" class="button" id="wbv_add_to_view" value="Add to the view" disabled="disabled">';
        html += '<select id="wbv_merge_objects" disabled="disabled"></select>';
        return html;
    }

    update() {
        super.update();
        for(const item of this.items) {
            item.update();
        }
    }
}

export {WBVObjectListWidget};