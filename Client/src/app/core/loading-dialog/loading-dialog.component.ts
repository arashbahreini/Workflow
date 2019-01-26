import { Component, OnInit, Injectable } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-loading-dialog',
  templateUrl: './loading-dialog.component.html',
  styleUrls: ['./loading-dialog.component.css']
})
export class LoadingDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<LoadingDialogComponent>,
  ) { }

  ngOnInit() {
  }
}
@Injectable()
export class LoadingService {
  constructor(private dialog: MatDialog) { }
  start() {
    setTimeout(() => {
      const dialogRef = this.dialog.open(LoadingDialogComponent, {
        disableClose: true,
        panelClass: 'loader__ui__panel',
        position: {
          top: '3%'
        }
      });
    }, 1);

  }

  stop() {
    this.dialog.closeAll();
  }
}
