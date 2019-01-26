import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ManagerModule } from './manager/manager.module';
import { DesignerModule } from './designer/designer.module';
import { HttpClientModule } from '@angular/common/http';
import { WorkflowService } from './services/workflow.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';
import { MaterialModule } from './common-module/material.module';
import { PrimeNgModule } from './common-module/prime-ng.module';
import { LogModule } from './log/log.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { RuleEngineModule } from './rule-engine/rule-engine.module';
import { DatePipe } from '@angular/common';
import { BasicInformationService } from './services/basic-information.service';
import { ErrorComponent } from './error/error.component';

@NgModule({
  declarations: [
    AppComponent,
    DeleteDialogComponent,
    ErrorComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ManagerModule,
    MaterialModule,
    PrimeNgModule,
    DesignerModule,
    LogModule,
    DashboardModule,
    RuleEngineModule,
    AppRoutingModule,
  ],
  exports: [],
  providers: [WorkflowService, DatePipe , BasicInformationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
