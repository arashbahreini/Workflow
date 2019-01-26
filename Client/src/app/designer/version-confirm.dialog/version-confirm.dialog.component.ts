import { Component, OnInit, Inject, Version } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { VersionConfirmModel } from '../../model/version-confirm.model';

@Component({
  selector: 'app-version-confirm.dialog',
  templateUrl: './version-confirm.dialog.component.html',
  styleUrls: ['./version-confirm.dialog.component.css']
})
export class VersionConfirmDialogComponent implements OnInit {

  public result: VersionConfirmModel = new VersionConfirmModel();

  constructor(
    private dialogRef: MatDialogRef<VersionConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public warningList: string[] = [],
  ) { }

  ngOnInit() {
  }

  closeDialog(res: boolean) {
    this.result.success = res;
    this.dialogRef.close(this.result);
  }
}
