import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RuleEngineDashboardComponent } from './rule-engine-dashboard/rule-engine-dashboard.component';
import { RuleEngineComponent } from './rule-engine.component';
import { CommonServicesService } from '../services/common-services.service';
import { RuleEngineManagementComponent } from './rule-engine-management/rule-engine-management.component';
import { RuleEngineTestComponent } from './rule-engine-test/rule-engine-test.component';

const routes: Routes = [
  {
    path: 'rule-engine', component: RuleEngineComponent, children: [
      { path: '', component: RuleEngineDashboardComponent },
      { path: 'management/:id', component: RuleEngineManagementComponent },
      { path: 'test/:id', component: RuleEngineTestComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RuleEngineRoutingModule {
}
