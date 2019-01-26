import { DeviceModelModel } from "./device-model.model";

export class BrandModel {
    public Id: number;
    public Title: number;
    public deviceModel: DeviceModelModel[];
    
    constructor() {
        this.deviceModel = [];
    }
}