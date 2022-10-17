import { WBObject } from "./WBObject";
declare abstract class WBMergeRecipe {
    id: string;
    name: string;
    ingredients: {};
    optional: {};
    protected constructor(name: string, ingredients: {});
    findIngredients(objects: WBObject[]): {};
    abstract merge(id: string, objects: WBObject[]): WBObject;
}
export { WBMergeRecipe };
