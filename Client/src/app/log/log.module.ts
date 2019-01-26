import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogComponent } from './log/log.component';
import { PrimeNgModule } from '../common-module/prime-ng.module';
import { LogService } from '../services/log.service';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../common-module/shared.module';
import { MaterialModule } from '../common-module/material.module';
import { GraphLogComponent } from './graph-log/graph-log.component';
import { SingleWorkflowLogComponent } from './single-workflow-log/single-workflow-log.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    PrimeNgModule,
    FormsModule,
    SharedModule,
    
  ],
  declarations: [
    LogComponent,
    GraphLogComponent,
    SingleWorkflowLogComponent,
  ],
  providers: [
    LogService
  ],
  entryComponents: [
    GraphLogComponent
  ]
})
export class LogModule { }
