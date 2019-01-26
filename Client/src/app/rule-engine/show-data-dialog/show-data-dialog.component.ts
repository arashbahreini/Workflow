import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource, MatPaginator } from '@angular/material';
import { IdTitleModel } from '../../model/id-title.model';

@Component({
  selector: 'app-show-data-dialog',
  templateUrl: './show-data-dialog.component.html',
  styleUrls: ['./show-data-dialog.component.css']
})
export class ShowDataDialogComponent implements OnInit {
  @ViewChild('matPaginator') pendingMatPaginator: MatPaginator;

  public dataSource = new MatTableDataSource<IdTitleModel>(this.data);
  public displayedColumns: string[] = ['Id', 'Title'];

  constructor(
    private dialogRef: MatDialogRef<ShowDataDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IdTitleModel[],
  ) {
  }
  ngOnInit() {
    this.dataSource.paginator = this.pendingMatPaginator;
  }

  selectItem(item) {
    this.dialogRef.close(item);
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
