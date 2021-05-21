import { WBViewer} from "./WBViewer/WBViewer.js";

// Global events
$(document).on('change', 'input[display-target]', function() {
    const target = $('#' + $(this).attr('display-target'));
    target.val($(this).val());
    //target.trigger("change");
    //target.change();
});


// Start the viewer
const elements = document.getElementsByClassName("wb-viewer");
for(const el of elements) new WBViewer(el);
