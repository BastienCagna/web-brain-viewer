
class WBSpace {
  name = null;

  constructor(name) {
    this.name = name;
  }
}

class WBTransformation {
  targetSpace = null;
  affineTransformation = null;
  nonLinearTransformation = null;

  constructor(targetspace, affineTransformation = null, nonLinearTransformation = null) {
    this.targetSpace = targetspace;
    this.affineTransformation = affineTransformation;
    this.nonLinearTransformation = nonLinearTransformation;
  }
}
