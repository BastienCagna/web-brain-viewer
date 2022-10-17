import { WBVWidget } from "./WBVWidget";
export default class WBVToolBar extends WBVWidget {
    name: string;
    collapsable: boolean;
    widgets: WBVWidget[];
    constructor(parent?: WBVWidget | HTMLElement, name?: string, classnames?: string[] | string);
    innerHTML(): string;
    update(): void;
}
