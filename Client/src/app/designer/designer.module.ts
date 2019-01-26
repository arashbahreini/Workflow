import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DesignerComponent } from './designer.component';
import { ConfigWorkflowComponent } from './config-workflow/config-workflow.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { TreeModule } from 'angular-tree-component';
import { MaterialModule } from '../common-module/material.module';
import { PrimeNgModule } from '../common-module/prime-ng.module';
import { XmlPipe } from '../pipes/xml.pipe';
import { MessageService } from 'primeng/components/common/messageservice';
import { VersionConfirmDialogComponent } from './version-confirm.dialog/version-confirm.dialog.component';
import { IsNotCommonTaskPipe } from '../pipes/is-not-common-task.pipe';
import { SettingLogicService } from '../logic/setting-logic.service';
import { TaskLogicService } from '../logic/task-logic.service';
import { WorkflowSaveValidationService } from '../validation/workflow-save-validation.service';
import { EmployeLogicService } from '../logic/employe-logic.service';
import { GraphLogicService } from '../logic/graph-logic.service';
import { GraphValidationService } from '../validation/graph-validation.service';
import { IsNotTypeSettingPipe } from '../pipes/is-not-type-setting.pipe';
import { TaskValidationService } from '../validation/task-validation.service';
import { SharedModule } from '../common-module/shared.module';
import { CoreModule } from '../core/core.module';
import { ShowConfigComponent } from './show-config/show-config.component';
import { ShowRulesDialogComponent } from './show-rules.dialog/show-rules.dialog.component';
const routes: Routes = [];

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    PrimeNgModule,
    FormsModule,
    TreeModule,
    RouterModule.forRoot(routes),
    SharedModule,
    CoreModule
  ],
  declarations: [
    DesignerComponent,
    ConfigWorkflowComponent,
    IsNotCommonTaskPipe,
    IsNotTypeSettingPipe,
    XmlPipe,
    VersionConfirmDialogComponent,
    ShowConfigComponent,
    ShowRulesDialogComponent,
  ],
  entryComponents: [
    DeleteDialogComponent,
    VersionConfirmDialogComponent,
    ShowRulesDialogComponent
  ],
  providers: [
    MessageService,
    SettingLogicService,
    TaskLogicService,
    WorkflowSaveValidationService,
    EmployeLogicService,
    GraphLogicService,
    GraphValidationService,
    TaskValidationService
  ]
})
export class DesignerModule { }
