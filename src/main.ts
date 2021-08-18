import { WBViewer} from "./WBViewer/WBViewer";

import WB3DView from "./WBViewer/WB3DView";
import {WBVOType, WBVTextReadableObjectWidget} from "./WBViewer/WBVWidgets/WBVObjectWidget";
import {WBMorphLabellingRecipe} from "./WBObjects/WBMorphologistObjects";
import {WBBasicColorMap, WBColorBar} from "./WBObjects/WBColorMap";
import { max, argsort } from "./utils";
import WBDataServer from "./WBControllers/WBDataServer";
import {WBGiftiImage} from "./WBObjects/WBGifti";

export {
    WB3DView,
    WBColorBar,
    WBBasicColorMap,
    WBDataServer,
    WBGiftiImage,
    WBMorphLabellingRecipe,
    WBVTextReadableObjectWidget,
    WBVOType,
    max, argsort
};

// Global events
$(document).on('change', 'input[display-target]', function() {
    const target = $('#' + $(this).attr('display-target'));
    target.val($(this).val());
    //target.trigger("change");
    //target.change();
});

// Start the viewer
const elements = Array.from(document.getElementsByClassName("wb-viewer"));
for(const el of elements) if(el instanceof HTMLElement) new WBViewer(el);

