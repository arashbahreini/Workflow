import { PipeTransform, Pipe } from '@angular/core';
import { TaskModel } from '../model/task.model';

@Pipe({
    name: 'isNotCommon',
    pure: false
})
export class IsNotCommonTaskPipe implements PipeTransform {
    transform(allTasks: TaskModel[]) {
        const result = allTasks.filter(task => task.isCommon === false);
        return result;
    }
}
