var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { WBVModal } from "./WBVModal";
import WBDataServer from "../../WBControllers/WBDataServer";
export class WBServerModal extends WBVModal {
    constructor(objectsWidget) {
        super("Load Data from Server");
        this.objectsWidget = objectsWidget;
        this.server = new WBDataServer("127.0.0.1:8000");
        const that = this;
        $(document).on('click', '#' + this.id + '_srv-update', function () {
            console.log('hello');
            that.server.url = $('#' + that.id + '_srv-ip').val().toString();
            that.update();
            console.log('new url: ' + that.server.url);
        });
        $(document).on('click', '.wbv-srv-load', function () {
            that.loadFile($(this));
        });
    }
    content() {
        let html = '<h6>Settings</h6><table><tr><td><label for="server-ip">URL:</label></td><td>' +
            '<input type="text" id="' + this.id + '_srv-ip" name="server-ip" value="' + this.server.url + '" />' +
            '<button class="btn btn-default" id="' + this.id + '_srv-update">Connect</button></td></tr>' +
            '<tr><td><label for="server-db">Database:</label></td>' +
            '<td><select id="' + this.id + '_srv-db" name="server-db"></select>' +
            '</td></tr>' +
            '<tr><td><label>Subject:</label></td>' +
            '<td><select id="' + this.id + '_srv-subs" name="server-subject"></select></td></tr>' +
            '</table>';
        html += '<p></p><h6>Import</h6><table>';
        html += '<tr><td>White Mesh</td><td>' +
            '<input type="button" class="wbv-srv-load" value="Left" query="mesh=white&hemi=L">' +
            '<input type="button" class="wbv-srv-load" value="Right" query="mesh=white&hemi=R"></td>';
        html += '<tr><td>Hemisphere Mesh</td><td>' +
            '<input type="button" class="wbv-srv-load" value="Left" query="mesh=hemi&hemi=L">' +
            '<input type="button" class="wbv-srv-load" value="Right" query="mesh=hemi&hemi=R"></td>';
        html += '</table>';
        return html;
    }
    update() {
        const that = this;
        this.server.listDatabases().then(function (response) {
            WBServerModal.updateSelect(response['databases'], 'name', 'name', that.id + '_srv-db');
            that.server.listSubjects(response['databases'][0]['name']).then(function (response) {
                WBServerModal.updateSelect(response['subjects'], 'name', 'name', that.id + '_srv-subs');
            });
        });
        super.update();
    }
    static updateSelect(optionsList, valueKey, labelKey, elementId) {
        let html = '';
        for (const opt of optionsList) {
            html += '<option value="' + opt[valueKey] + '">' + opt[labelKey] + '</option>';
        }
        document.getElementById(elementId).innerHTML = html;
    }
    loadFile(e) {
        return __awaiter(this, void 0, void 0, function* () {
            const dbname = $('#' + this.id + '_srv-db').val().toString();
            const subname = $('#' + this.id + '_srv-subs').val().toString();
            let q = e.attr('query');
            q += '&sub=' + subname;
            const file = yield this.server.loadFile(dbname, q);
            const infos = yield this.server.loadFileInfos(dbname, q);
            this.objectsWidget.addObject(file, infos.name);
        });
    }
}
//# sourceMappingURL=WBVServerModal.js.map