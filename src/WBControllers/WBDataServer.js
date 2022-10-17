var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export default class WBDataServer {
    constructor(url) {
        this.url = url;
    }
    listDatabases() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield fetch("http://" + this.url + "/bv/").then(function (response) { return response.json(); });
        });
    }
    listSubjects(database) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield fetch("http://" + this.url + "/bv/" + database).then(function (response) { return response.json(); });
        });
    }
    loadFile(database, query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield fetch("http://" + this.url + "/bv/" + database + "?" + query + '&as=file').then(function (response) { return response.blob(); });
        });
    }
    loadFileInfos(database, query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield fetch("http://" + this.url + "/bv/" + database + "?" + query + '&as=infos&limit=1').then(function (response) { return response.json(); });
        });
    }
}
//# sourceMappingURL=WBDataServer.js.map