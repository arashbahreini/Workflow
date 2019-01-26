import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManagerComponent } from './manager.component';
import { MaterialModule } from '../common-module/material.module';
import { PrimeNgModule } from '../common-module/prime-ng.module';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../common-module/shared.module';
import { LoadingService } from '../core/loading-dialog/loading-dialog.component';
import { CoreModule } from '../core/core.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    PrimeNgModule,
    FormsModule,
    SharedModule,
    CoreModule,
  ],
  declarations: [ManagerComponent],
  providers: [LoadingService]
})
export class ManagerModule { }
