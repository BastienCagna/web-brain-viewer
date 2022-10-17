import * as THREE from 'three';
import { WBVWidget } from './WBVWidgets/WBVWidget';
import { WBObject } from "../WBObjects/WBObject";
import WBVViewWidget from "./WBVWidgets/WBVViewWidget";
declare class WB3DCross extends THREE.Vector3 {
    vector: any;
    visible: boolean;
    color: THREE.Color;
    constructor(x?: number, y?: number, z?: number);
    setPosition(x: any, y: any, z: any): void;
}
export declare abstract class WBView extends WBVWidget {
    title: string;
    type: string;
    toolbar: any;
    objects: any[];
    mouse: THREE.Vector2;
    cursor: WB3DCross;
    height: number;
    width: number;
    viewWidget: WBVViewWidget;
    protected constructor(parent?: WBVWidget | HTMLElement, width?: number, height?: number, classnames?: string[] | string);
    innerHTML(): string;
    viewElement(): HTMLElement;
    setDimensions(width?: number, height?: number): void;
    abstract addObject(obj: WBObject): void;
    abstract removeObjectByName(name: string): void;
    abstract onWindowResize(): void;
    update(): void;
}
export {};
