import { WBVWidget } from "./WBVWidget";
declare class WBFileBroswer extends WBVWidget {
    currentFolder: string;
    constructor(parent?: WBVWidget | HTMLElement, path?: string);
    innerHTML(): string;
    update(): void;
}
export { WBFileBroswer };
