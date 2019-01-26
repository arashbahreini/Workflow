import { PipeTransform, Pipe } from "@angular/core";
import { SettingModel } from "../model/setting.model";

@Pipe({ 
    name: 'isNotType',
    pure: false
})
export class IsNotTypeSettingPipe implements PipeTransform {
    transform(allSettings: SettingModel[]) {
        let result = allSettings.filter(setting => setting.Name !== 'type');
        return result;
    }
}