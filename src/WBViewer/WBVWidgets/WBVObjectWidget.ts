import {WBVWidget} from "./WBVWidget";
import {WBObject, WBOState, WBTextReadableObject} from "../../WBObjects/WBObject";
import {WBMorphFoldsInfosObject, WBMorphNomenclatureObject} from "../../WBObjects/WBMorphologistObjects";
import {WBGiftiImage} from '../../WBObjects/WBGifti'


enum WBVOType {
    WBVODefault,
    WBVOTr,
    WBVOLi
}


class WBVObjectWidget extends WBVWidget {
    object: WBObject = null;
    type: WBVOType;

    constructor(parent: WBVWidget|HTMLElement = null, object: WBObject = null, type: WBVOType = WBVOType.WBVODefault) {
        super(parent);
        this.object = object;
        this.type = type;
    }

    innerHTML(): string {
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
            case WBVOType.WBVOTr: return '<tr class="wbv-object-item link-button" id="' + this.id + '"><td>' + stateHtml + "</td><td>" + this.object.id + "</td><td>" + this.object.type + "</td></tr>";
            case WBVOType.WBVOLi: return '<li class="wbv-object-item link-button" id="' + this.id + '"><p>' + this.object.id + ', ' + this.object.state + '(' + this.object.type + ')</p></li>';
            case WBVOType.WBVODefault:
            default: return this.object.id + ", " + this.object.state + "(" + this.object.type + ")";
        }
    }
}


class WBVTextReadableObjectWidget extends WBVObjectWidget {
    selected: boolean;

    constructor(parent: WBVWidget|HTMLElement = null, file: File|Blob = null,
                fid: string = null, type: WBVOType = WBVOType.WBVODefault) {
        super(parent, null, type);
        this.selected = false;
        if(file) this.object = this.loadFile(file, fid);
    }

    loadFile(file:File|Blob, fid:string = null): WBTextReadableObject {
        const extension = (file instanceof File) ? file.name.split('.').slice(-1)[0] : fid.split('.').slice(-1)[0];

        let f = null;
        switch (extension) {
            case "gii": f = new WBGiftiImage(fid); break;
            case "arg": f = new WBMorphFoldsInfosObject(fid); break;
            case "hie": f = new WBMorphNomenclatureObject(fid); break;
            default:
                console.log("/!\\ Undefined WBFile class for extension " + extension);
                return null;
        }
        f.loadFile(file);
        f.onStateChange = (function () { this.update(); }).bind(this);
        return f;
    }
}

export {WBVObjectWidget, WBVOType, WBVTextReadableObjectWidget};
