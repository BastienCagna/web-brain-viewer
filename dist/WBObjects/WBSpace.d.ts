declare class WBSpace {
    name: any;
    constructor(name: any);
}
declare class WBTransformation {
    targetSpace: any;
    affineTransformation: any;
    nonLinearTransformation: any;
    constructor(targetspace: any, affineTransformation?: any, nonLinearTransformation?: any);
}
export { WBSpace, WBTransformation };
