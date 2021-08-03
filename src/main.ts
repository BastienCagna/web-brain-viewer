import { WBViewer} from "./WBViewer/WBViewer";

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

