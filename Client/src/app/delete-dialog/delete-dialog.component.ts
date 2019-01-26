import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.css']
})
export class DeleteDialogComponent implements OnInit {
  public message: string;
  constructor(
    private dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { 
    this.message = data;
  }

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close();
  }

  confirmDelete() {
    this.dialogRef.close(true);
  }
}
