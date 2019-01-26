import { Injectable } from "@angular/core";
import { MatPaginatorIntl } from "@angular/material";

@Injectable()
export class MatPaginatorPersian extends MatPaginatorIntl {
    itemsPerPageLabel = 'تعداد ایتم در هر صفحه';
    nextPageLabel = 'صفحه ی بعدی';
    previousPageLabel = 'صفحه ی قبلی';
    firstPageLabel = 'صفحه ی اول';
    lastPageLabel = 'صفحه ی آخر';

    getRangeLabel = (page: number, pageSize: number, length: number) => {
        let ttt = ((page * pageSize) + 1) + ' - ' + ((page * pageSize) + pageSize) + ' از ' + length + ' صفحه ';
        return ((page * pageSize) + 1) + ' - ' + ((page * pageSize) + pageSize) + ' از ' + length + ' صفحه ';
    }
}