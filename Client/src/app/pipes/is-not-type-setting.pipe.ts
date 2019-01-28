import { PipeTransform, Pipe } from '@angular/core';
import { SettingModel } from '../model/setting.model';

@Pipe({
  name: 'isNotType',
  pure: false
})
export class IsNotTypeSettingPipe implements PipeTransform {
  transform(allSettings: SettingModel[]) {
    const result = allSettings.filter(setting => setting.name !== 'type');
    return result;
  }
}
