class WBSpace {
    constructor(name) {
        this.name = null;
        this.name = name;
    }
}
class WBTransformation {
    constructor(targetspace, affineTransformation = null, nonLinearTransformation = null) {
        this.targetSpace = null;
        this.affineTransformation = null;
        this.nonLinearTransformation = null;
        this.targetSpace = targetspace;
        this.affineTransformation = affineTransformation;
        this.nonLinearTransformation = nonLinearTransformation;
    }
}
export { WBSpace, WBTransformation };
//# sourceMappingURL=WBSpace.js.map