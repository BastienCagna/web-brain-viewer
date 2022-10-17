declare enum WBOState {
    None = 0,
    Loading = 1,
    Ready = 2,
    Used = 3,
    Error = 4
}
declare abstract class WBObject {
    uid: string;
    id: string;
    type: string;
    state: WBOState;
    onStateChange: any;
    usages: number;
    protected constructor(id?: string);
    updateState(state: WBOState): void;
    toObject3D(): THREE.Object3D | THREE.Object3D[];
}
declare abstract class WBTextReadableObject extends WBObject {
    fr: FileReader;
    onLoadEnd: any;
    protected constructor(id?: string);
    loadFile(file: File): void;
    abstract parseFile(): void;
}
export { WBObject, WBTextReadableObject, WBOState };
