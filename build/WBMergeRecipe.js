import { MathUtils } from "../dependencies/three.js/build/three.module.js";
var generateUUID = MathUtils.generateUUID;
class WBMergeRecipe {
    constructor(name, ingredients) {
        this.id = generateUUID();
        this.name = name;
        this.ingredients = ingredients;
    }
    findIngredients(objects) {
        let ingredients = {};
        let specOk = {};
        for (const [type, n] of Object.entries(this.ingredients)) {
            const str = n.toString();
            const spec = (str.localeCompare('+') === 0) ? Number.MAX_SAFE_INTEGER : parseInt(str, 10);
            ingredients[type] = [];
            for (const obj of objects) {
                if (obj.constructor.name.localeCompare(type) === 0 || obj.type.localeCompare(type) === 0) {
                    if (spec == 1) {
                        ingredients[type] = obj;
                        specOk[type] = true;
                        break;
                    }
                    else {
                        ingredients[type].push(obj);
                    }
                    if (ingredients[type].length >= spec) {
                        specOk[type] = true;
                        break;
                    }
                }
            }
            if (ingredients[type].length < spec) {
                return null;
            }
        }
        return ingredients;
    }
}
export { WBMergeRecipe };
//# sourceMappingURL=WBMergeRecipe.js.map