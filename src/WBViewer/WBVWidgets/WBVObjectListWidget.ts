import {WBObject, WBOState, WBTextReadableObject} from "../../WBObjects/WBObject.js";
import {WBMorphFoldsInfosObject, WBMorphLabellingRecipe, WBMorphNomenclatureObject} from "../../WBObjects/WBMorphologistObjects.js";
import WBVSectionWidget from "./WBVSectionWidget.js";
import {WBVWidget} from "./WBVWidget.js";
//import {WBGiftiImage} from "../../WBObjects/WBGifti.js";
import {WBMergeRecipe} from "../../WBObjects/WBMergeRecipe.js";
import {WBTexturedMeshRecipe} from "../../WBObjects/WBSurfacesObjects.js";
import {WBServerModal} from "./WBVServerModal.js";
import {WBView} from "../WBView.js";
import {WBVObjectWidget, WBVTextReadableObjectWidget, WBVOType} from "./WBVObjectWidget.js";
import {CurveUtils} from "three";
import interpolate = CurveUtils.interpolate;


class WBVObjectListWidget extends WBVSectionWidget {
    items: WBVObjectWidget[];
    counts: {};
    mergeRecipes: WBMergeRecipe[];
    serverModal: WBServerModal;
    targetView: WBView;
    objectList: HTMLElement;

    constructor(parent: WBVWidget = null, targetView: WBView = null) {
        super(parent, 'Objects');
        this.items = [];
        this.counts = {};
        this.targetView = targetView;
        this.serverModal = new WBServerModal(this);

        this.mergeRecipes = [
            new WBTexturedMeshRecipe(), new WBMorphLabellingRecipe()
        ];

        const that = this;

        // Add selected object to the view
        $(document).on('click', '#wbv_add_to_view', function(){
            that.addSelectedObjectsToTargetView();});
        // COMPUTER LOADING
        $(document).on('change', '#wbv_add_file', function(event) {
            for(const file of event.target.files) that.addObject(file); });
        //  SERVER LOADING
        $(document).on('click', "#wbv_add_from_server", function() { that.serverModal.show(); });
        //  OBJECTS MERGING
        $(document).on('click', '.wbv-object-item', function() {
            if($(this).attr('selected')) $(this).removeAttr('selected');
            else $(this).attr('selected', 'selected');
            that.checkMergingAvailability();
        })
        $(document).on('change', '#wbv_merge_objects', function() { that.mergeSelected($(this).val()); });
    }

    getObjectList(): HTMLElement {
        return document.getElementById(this.id + '_list');
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

    checkMergingAvailability(): void {
        const nSel = $(".wbv-object-item[selected]").length;
        let validRecipes = [];
        if(nSel > 1) {
            const objects = this.selectedObjects();
            for (const recipe of this.mergeRecipes) {
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
    }

    mergeSelected(value): void {
        if(value !== -1) {
            for(const recipe of this.mergeRecipes) {
                if(recipe.id === value) {
                    const name = this.checkName("Fusion");
                    const newObj = recipe.merge(name, this.selectedObjects());
                    if(!newObj) {
                        throw new Error("Merging failed");
                    }
                    const widget = new WBVObjectWidget(this.getObjectList(), newObj, WBVOType.WBVOTr);
                    this.items.push(widget);
                    widget.update();
                    break;
                }
            }
        }
    }

    addSelectedObjectsToTargetView(): void {
        for(const obj of this.selectedObjects()) {
            this.targetView.addObject(obj);
        }
    }

    addObject(file: Blob, filename: string = null): void {
        filename = this.checkName( filename ? filename : (file instanceof File) ? file.name : "Unknown");
        const newItem = new WBVTextReadableObjectWidget(
            this.getObjectList(), file, filename, WBVOType.WBVOTr);
        if(newItem.object)
            this.items.push(newItem);
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
        html += '<input type="button" class="button" value="Open files..." onclick="document.getElementById(\'wbv_add_file\').click();">';
        html += '<input type="button" class="button" value="Load from server..." id="wbv_add_from_server">';
        html += '<input type="button" class="button" id="wbv_add_to_view" value="Add to the current view" disabled="disabled">';
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
