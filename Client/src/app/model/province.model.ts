import { CityModel } from './city.model';

export class ProvinceModel {
    public Id: number;
    public Title: string;
    public Cities: CityModel[];

    constructor() {
        this.Cities = [];
    }
}

