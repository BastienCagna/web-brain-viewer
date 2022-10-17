export declare abstract class WBVWidget {
    id: string;
    parent: WBVWidget | HTMLElement;
    classnames: string[];
    tag: string;
    protected constructor(parent?: WBVWidget | HTMLElement, classnames?: string[] | string);
    abstract innerHTML(): string;
    update(): void;
}
