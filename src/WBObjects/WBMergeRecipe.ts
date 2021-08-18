import {MathUtils} from 'three'; //"https://unpkg.com/three@0.126.1/build/three.module";
import generateUUID = MathUtils.generateUUID;
import {WBObject} from "./WBObject";


abstract class WBMergeRecipe {
    id: string;
    name: string;
    ingredients: {};
    optional: {};

    protected constructor(name: string, ingredients: {}) {
        this.id = generateUUID();
        this.name = name;
        this.optional = {};
        this.ingredients = {};
        const types = Object.keys(ingredients);
        for(const type of types) {
            this.optional[type] = ingredients[type] < 0;
            this.ingredients[type] = Math.abs(ingredients[type]);
        }
    }

    findIngredients(objects: WBObject[]): {} {
        let ingredients = {};
        let specOk = {};
        for(const [type, n] of Object.entries(this.ingredients)) {
            const str = n.toString();
            const spec = (str.localeCompare('+')===0) ? Number.MAX_SAFE_INTEGER : parseInt(str, 10);

            ingredients[type] = [];
            for(const obj of objects) {
                // FIXME: checking also the type is a beat tricky to load ingredients when merging. It could be better.
                if(obj.constructor.name.localeCompare(type)===0 || obj.type.localeCompare(type)===0) {
                    if(spec == 1) {
                        ingredients[type] = obj;
                        specOk[type] = true;
                        break;
                    } else {
                        ingredients[type].push(obj);
                    }

                    if(ingredients[type].length >= spec) {
                        specOk[type] = true;
                        break;
                    }
                }
            }
            if(ingredients[type].length < spec) {
                if(this.optional[type]) {
                    ingredients[type] = null;
                } else {
                    return null;
                }
            }
        }

        return ingredients;
    }

    abstract merge(id: string, objects: WBObject[]): WBObject;
}


export { WBMergeRecipe };
