import { WBOState } from "./WBObject.js";
import { WBMorphLabellingObject, WBMorphNomenclatureObject } from "./WBMorphologistObjects.js";
import WBVSectionWidget from "./WBVSectionWidget.js";
import { WBVWidget } from "./WBVWidget.js";
import { WBGiftiImage } from "./WBGifti.js";
var WBVOType;
(function (WBVOType) {
    WBVOType[WBVOType["WBVODefault"] = 0] = "WBVODefault";
    WBVOType[WBVOType["WBVOTr"] = 1] = "WBVOTr";
    WBVOType[WBVOType["WBVOLi"] = 2] = "WBVOLi";
})(WBVOType || (WBVOType = {}));
class WBVObjectWidget extends WBVWidget {
    constructor(parentId = null, id = null, object = null, type = WBVOType.WBVODefault) {
        super(parentId, id);
        this.object = null;
        this.object = object;
        this.type = type;
    }
    html() {
        let stateHtml;
        switch (this.object.state) {
            case WBOState.Loading:
                stateHtml = '<div class="spinner-border spinner-border-sm"> </div>';
                break;
            case WBOState.Ready:
                stateHtml = '<div class="wb-badge-sm bg-success"> </div>';
                break;
            case WBOState.Used:
                stateHtml = '<div class="wb-badge-sm bg-primary"> </div>';
                break;
            case WBOState.Error:
                stateHtml = '<div class="wb-badge-sm bg-danger"> </div>';
                break;
            case WBOState.WBONone:
            default:
                stateHtml = '<div class="wb-badge-sm bg-secondary"></div>';
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
    constructor(parentId = null, id = null, file = null, fid = null, type = WBVOType.WBVODefault) {
        super(parentId, id, null, type);
        if (file) {
            this.object = this.loadFile(file, fid);
        }
    }
    loadFile(file, fid = null) {
        const extension = file.name.split('.').slice(-1)[0];
        let f = null;
        switch (extension) {
            case "gii":
                f = new WBGiftiImage(fid);
                break;
            case "arg":
                f = new WBMorphLabellingObject(fid);
                break;
            case "hie":
                f = new WBMorphNomenclatureObject(fid);
                break;
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
    constructor(parentId = null) {
        super(parentId, 'Objects');
        this.items = [];
        this.counts = {};
        $(document).on('change', '#wbv_add_file', function (event) {
            for (const file of event.target.files) {
                let fid;
                if (this.counts[file.name] === undefined) {
                    fid = file.name;
                    this.counts[file.name] = 1;
                }
                else {
                    fid = file.name + "(" + this.counts[file.name] + ")";
                    this.counts[file.name] += 1;
                }
                const newItem = new WBVTextReadableObjectWidget(this.id + "_list", null, file, fid, WBVOType.WBVOTr);
                this.items.push(newItem);
            }
        }.bind(this));
        $(document).on('click', '.wbv-object-item', function () {
            if ($(this).attr('selected')) {
                $(this).removeAttr('selected');
            }
            else {
                $(this).attr('selected', 'selected');
            }
            if ($(".wbv-object-item[selected]").length > 0) {
                $("#wbv_add_view").removeAttr("disabled");
            }
            else {
                $("#wbv_add_view").attr("disabled", "disabled");
            }
        });
    }
    bodyHtml() {
        let html = '<table><thead><tr><th></th></th><th>Name</th><th>Type</th></tr></thead><tbody id="' + this.id + '_list">';
        html += '</tbody></table>';
        html += '<input type="file" class="phantom" id="wbv_add_file" name="wbv_add_file" multiple="multiple"/>';
        html += '<input type="button" class="button" value="Open files" onclick="document.getElementById(\'wbv_add_file\').click();">';
        html += '<input type="button" class="button" id="wbv_add_view" value="New view" disabled="disabled">';
        return html;
    }
    update() {
        super.update();
        for (const item of this.items) {
            item.update();
        }
    }
}
export { WBVObjectListWidget };
//# sourceMappingURL=WBVObjectListWidget.js.map