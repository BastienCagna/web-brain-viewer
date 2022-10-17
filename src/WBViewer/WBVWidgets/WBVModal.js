import { WBVWidget } from "./WBVWidget";
export class WBVModal extends WBVWidget {
    constructor(title, classnames = []) {
        super(document.body, classnames);
        this.classnames.push("modal");
        this.title = title;
    }
    innerHTML() {
        let html = '<div class="modal-dialog"><div class="modal-content">';
        html += '<div class="modal-header"> <h5 class="modal-title">' + this.title + '</h5>';
        html += '<button type="button" class="close" data-dismiss="#' + this.id + '" aria-label="Close">';
        html += '<span aria-hidden="true">&times;</span></button></div><div class="modal-body">';
        html += this.content() + '</div><div class="modal-footer">';
        html += '<button type="button" class="btn btn-secondary" data-dismiss="#' + this.id + '">Close</button>';
        html += '</div></div></div>';
        return html;
    }
    show() {
        this.update();
        $('#' + this.id).show();
    }
    hide() {
        $('#' + this.id).hide();
    }
    update() {
        super.update();
        const el = document.getElementById(this.id);
        el.setAttribute("tabindex", "-1");
    }
}
$(document).on('click', '[data-dismiss]', function () {
    $($(this).attr('data-dismiss')).hide();
});
//# sourceMappingURL=WBVModal.js.map