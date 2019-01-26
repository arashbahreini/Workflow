import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingDialogComponent } from './loading-dialog/loading-dialog.component';
import { MaterialModule } from '../common-module/material.module';
import { PrimeNgModule } from '../common-module/prime-ng.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    PrimeNgModule
  ],
  declarations: [LoadingDialogComponent],
  exports: [LoadingDialogComponent],
  entryComponents: [LoadingDialogComponent]
})
export class CoreModule { }
