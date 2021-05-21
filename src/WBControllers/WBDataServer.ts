
export default class WBDataServer {
    url: string;

    public constructor(url: string) {
        this.url = url;
    }

    public async listDatabases() {
        return await fetch("http://" + this.url + "/bv/").then(
                function(response) { return response.json(); });
    }

    public async listSubjects(database: string) {
        return await fetch("http://" + this.url + "/bv/" + database).then(
            function(response) { return response.json(); });
    }

    public async loadFile(database: string, query: string) {
        return await fetch("http://" + this.url + "/bv/" + database + "?" + query + '&as=file').then(
            function(response) { return response.blob(); });
    }

    public async loadFileInfos(database: string, query: string) {
        return await fetch("http://" + this.url + "/bv/" + database + "?" + query + '&as=infos&limit=1').then(
            function(response) { return response.json(); });
    }
}
