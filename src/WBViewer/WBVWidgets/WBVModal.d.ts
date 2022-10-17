import { WBVWidget } from "./WBVWidget";
export declare abstract class WBVModal extends WBVWidget {
    title: string;
    protected constructor(title: any, classnames?: string[] | string);
    abstract content(): string;
    innerHTML(): string;
    show(): void;
    hide(): void;
    update(): void;
}
