import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManagerComponent } from './manager/manager.component';
import { DesignerComponent } from './designer/designer.component';
import { ConfigWorkflowComponent } from './designer/config-workflow/config-workflow.component';
import { LogComponent } from './log/log/log.component';
import { SingleWorkflowLogComponent } from './log/single-workflow-log/single-workflow-log.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ShowConfigComponent } from './designer/show-config/show-config.component';
import { RuleEngineComponent } from './rule-engine/rule-engine.component';
import { ErrorComponent } from './error/error.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  { path: 'dashboard', component: DashboardComponent},
  { path: 'manager', component: ManagerComponent},
  { path: 'designer', component: DesignerComponent },
  { path: 'designer/config/:id/:version', component: ConfigWorkflowComponent},
  { path: 'designer/config', component: ConfigWorkflowComponent},
  { path: 'single-workflow-log/:workflowId/:requestId', component: SingleWorkflowLogComponent},
  { path: 'log', component: LogComponent},
  { path: 'designer/show-config/:id/:version', component: ShowConfigComponent},
  { path: 'error', component: ErrorComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(
    routes,
    {
      useHash: true,
    }
  )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
