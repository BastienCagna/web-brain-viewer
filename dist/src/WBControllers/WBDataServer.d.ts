export default class WBDataServer {
    url: string;
    constructor(url: string);
    listDatabases(): Promise<any>;
    listSubjects(database: string): Promise<any>;
    loadFile(database: string, query: string): Promise<Blob>;
    loadFileInfos(database: string, query: string): Promise<any>;
}
