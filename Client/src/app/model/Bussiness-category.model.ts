import { GetBussinessCategorySuplyModel } from "./bussiness-category-suply.model";

export class BussinessCategoryModel {
    public Id: number;
    public Title: string;
    public GetBussinessCategorySuplies: GetBussinessCategorySuplyModel[];

    constructor() {
        this.GetBussinessCategorySuplies = [];
    }
}