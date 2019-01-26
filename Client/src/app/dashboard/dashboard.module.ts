import { NgModule, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { PrimeNgModule } from '../common-module/prime-ng.module';
import { MaterialModule } from '../common-module/material.module';
import { PendingTaskGraphComponent } from './pending-task-graph/pending-task-graph.component';
import { WorkflowDetailGraphComponent } from './workflow-detail-graph/workflow-detail-graph.component';
import { WorkflowListDialogComponent } from './workflow-list-dialog/workflow-list-dialog.component';
import { SharedModule } from '../common-module/shared.module';
import { MatPaginatorIntl } from '../../../node_modules/@angular/material';
import { MatPaginatorPersian } from '../core/MatPaginatorPersian';

@NgModule({
  imports: [
    CommonModule,
    PrimeNgModule,
    MaterialModule,
    SharedModule
  ],
  declarations: [
    DashboardComponent,
    PendingTaskGraphComponent,
    WorkflowDetailGraphComponent,
    WorkflowListDialogComponent,
  ], entryComponents: [
    WorkflowListDialogComponent
  ],
  providers: [
    {
      provide: MatPaginatorIntl,
      useClass: forwardRef(() => MatPaginatorPersian)
    }
  ],
})
export class DashboardModule { }
