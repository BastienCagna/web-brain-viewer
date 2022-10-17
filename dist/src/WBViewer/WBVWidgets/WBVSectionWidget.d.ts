import { WBVWidget } from "./WBVWidget";
export default abstract class WBVSectionWidget extends WBVWidget {
    title: string;
    hideWhenEmpty: boolean;
    protected constructor(parent?: WBVWidget | HTMLElement, title?: string, classnames?: string[] | string);
    abstract bodyHtml(): string;
    innerHTML(): string;
    update(): void;
    HTMLElement(): HTMLElement;
}
