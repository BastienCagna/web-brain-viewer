import { WBViewer} from "./WBViewer.js";

// Global events
$(document).on('change', 'input[display-target]', function() {
    const target = $('#' + $(this).attr('display-target'));
    target.val($(this).val());
    //target.trigger("change");
    //target.change();
});


// Start the viewer
new WBViewer("wb-viewer");
