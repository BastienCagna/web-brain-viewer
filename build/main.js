import { WBViewer } from "./WBViewer.js";
$(document).on('change', 'input[display-target]', function () {
    const target = $('#' + $(this).attr('display-target'));
    target.val($(this).val());
});
new WBViewer("wb-viewer");
//# sourceMappingURL=main.js.map