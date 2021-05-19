import {WBVModal} from "./WBVModal.js";
import WBDataServer from "./WBDataServer.js";
import {WBVObjectListWidget, WBVObjectWidget, WBVOType} from "./WBVObjectListWidget.js";
import {WBMeshObject} from "./WBSurfacesObjects.js";
import {WBOState} from "./WBObject.js";


export class WBServerModal extends WBVModal {
    server: WBDataServer;
    objectsWidget: WBVObjectListWidget;

    public constructor(objectsWidget: WBVObjectListWidget) {
        super();

        this.objectsWidget = objectsWidget;
        this.server = new WBDataServer("127.0.0.1:8000");
        //this.subjects = this.server.listSubjects(this.databases[0]);

        const that = this;
        $(document).on('click', '#' + this.id + '_srv-update', function() {
            console.log('hello');
           that.server.url = $('#' + that.id + '_srv-ip').val().toString();
           that.update();
           console.log('new url: ' + that.server.url);
        });
        $(document).on('click', '.wbv-srv-load', function () {
            that.loadFile($(this));
        });
    }

    public title(): string {
        return "Load Online Data";
    }

    public content(): string {
        let html = '<h6>Settings</h6><table><tr><td><label for="server-ip">URL:</label></td><td>' +
            '<input type="text" id="' + this.id + '_srv-ip" name="server-ip" value="' + this.server.url + '" />' +
            '<button class="btn btn-default" id="' + this.id + '_srv-update">Connect</button></td></tr>' +
            '<tr><td><label for="server-db">Database:</label></td>' +
            '<td><select id="' + this.id + '_srv-db" name="server-db"></select>' +
            '</td></tr>' +
            '<tr><td><label>Subject:</label></td>' +
            '<td><select id="' + this.id + '_srv-subs" name="server-subject"></select></td></tr>' +
            '</table>';

        //const choices = ['White Mesh', 'Hemisphere Mesh', 'Folding Graph', 'Labelled Folding Graph'];
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

    public update() {
        const that = this;
        this.server.listDatabases().then(function(response) {
            WBServerModal.updateSelect(response['databases'], 'name', 'name', that.id + '_srv-db');

            that.server.listSubjects(response['databases'][0]['name']).then(function(response) {
                WBServerModal.updateSelect(response['subjects'], 'name', 'name', that.id + '_srv-subs');
            });
        });
        super.update();

        /*const elements = document.getElementsByClassName("wbv-srv-load");
        if(elements.length > 0) {
            for (let e of elements) {
                e.onclick = this.loadFile;
            }
        }*/
    }

    private static updateSelect(optionsList: [{}], valueKey: string, labelKey: string, elementId: string): void {
        let html = '';
        for(const opt of optionsList) {
            html += '<option value="' + opt[valueKey] + '">' + opt[labelKey] + '</option>';
        }
        document.getElementById(elementId).innerHTML = html;
    }

    public async loadFile(e): Promise<any> {
        const dbname = $('#' + this.id + '_srv-db').val().toString();
        const subname = $('#' + this.id + '_srv-subs').val().toString();
        let q = e.attr('query');
        q += '&sub=' + subname;
        q += '&as=data';
        const data = await this.server.loadFile(dbname, q);

        /*let gii = new WBGiftiImage();
        gii.darrays = [
            new WBGiftiDataArray(mesh.vertices, WBNiftiIntent.NIFTI_INTENT_POINTSET),
            new WBGiftiDataArray(mesh.triangles, WBNiftiIntent.NIFTI_INTENT_TRIANGLE)
            ];*/
        // TODO: should be done by the server:
        const fname = dbname + '/' + subname + ' ' + e.attr('query');
        const mesh = new WBMeshObject(fname, data.vertices, data.triangles);
        mesh.state = WBOState.Ready;

        const objW = new WBVObjectWidget(this.objectsWidget.id + "_list", null, mesh, WBVOType.WBVOTr);
        this.objectsWidget.items.push(objW);
        this.objectsWidget.update();
        this.hide();
    }
}
