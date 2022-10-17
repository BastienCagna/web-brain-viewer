import { WBVModal } from "./WBVModal";
import WBDataServer from "../../WBControllers/WBDataServer";
import { WBVObjectListWidget } from "./WBVObjectListWidget";
export declare class WBServerModal extends WBVModal {
    server: WBDataServer;
    objectsWidget: WBVObjectListWidget;
    constructor(objectsWidget: WBVObjectListWidget);
    content(): string;
    update(): void;
    private static updateSelect;
    loadFile(e: any): Promise<any>;
}
