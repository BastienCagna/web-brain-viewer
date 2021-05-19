import {WBVWidget} from "./WBVWidget.js";


export abstract class WBVModal extends WBVWidget {

    /**
     * @param id
     * @protected
     */
    public constructor(id: string = null) {
        super("modal-container", id);
        let p = document.getElementById('modal-container');
        if(!p) {
            document.body.innerHTML += '<div id="modal-container"></div>';
        }
    }

    abstract title(): string;
    abstract content(): string;

    public html(): string {
        let html = '<div class="modal" tabindex="-1" id="' + this.id + '">';
        html += '<div class="modal-dialog"><div class="modal-content">';
        html += '<div class="modal-header"> <h5 class="modal-title">' + this.title() + '</h5>';
        html += '<button type="button" class="close" data-dismiss="modal" aria-label="Close">';
        html += '<span aria-hidden="true">&times;</span></button></div><div class="modal-body">';
        html += this.content() + '</div><div class="modal-footer">';
        html += '<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>';
        html += '</div></div></div></div>';
        return html;
    }

    public show(): void {
        this.update();
        $('#' + this.id).show();
    }

    public hide(): void {
        $('#' + this.id).hide();
    }
}
