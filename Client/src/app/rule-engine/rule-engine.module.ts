import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RuleEngineRoutingModule } from './rule-engine-routing.module';
import { RuleEngineDashboardComponent } from './rule-engine-dashboard/rule-engine-dashboard.component';
import { RuleEngineComponent } from './rule-engine.component';
import { MaterialModule } from '../common-module/material.module';
import { PrimeNgModule } from '../common-module/prime-ng.module';
import { ShowRuleGroupsComponent } from './show-rule-groups/show-rule-groups.component';
import { ShowRuleItemsComponent } from './show-rule-items/show-rule-items.component';
import { CommonServicesService } from '../services/common-services.service';
import { RuleEngineService } from '../services/rule-engine.service';
import { LoadingService } from '../core/loading-dialog/loading-dialog.component';
import { SharedModule } from '../common-module/shared.module';
import { BasicInformationService } from '../services/basic-information.service';
import { FormsModule } from '@angular/forms';
import { RuleEngineManagementComponent } from './rule-engine-management/rule-engine-management.component';
import { RuleEngineTestComponent } from './rule-engine-test/rule-engine-test.component';
import { DpDatePickerModule } from 'ng2-jalali-date-picker';
import { ShowDataDialogComponent } from './show-data-dialog/show-data-dialog.component';
import { AddEditExceptionComponent } from './add-edit-exception-dialog/add-edit-exception-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    PrimeNgModule,
    RuleEngineRoutingModule,
    SharedModule,
    DpDatePickerModule,
  ],
  declarations: [
    RuleEngineDashboardComponent,
    RuleEngineComponent,
    RuleEngineManagementComponent,
    ShowRuleGroupsComponent,
    ShowRuleItemsComponent,
    RuleEngineTestComponent,
    ShowDataDialogComponent,
    AddEditExceptionComponent,
  ],
  providers: [
    CommonServicesService,
    RuleEngineService,
    LoadingService,
    BasicInformationService
  ], entryComponents: [
    ShowDataDialogComponent,
    AddEditExceptionComponent,
  ]
})
export class RuleEngineModule { }
