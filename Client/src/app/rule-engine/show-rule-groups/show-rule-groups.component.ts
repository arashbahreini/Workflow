import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { RuleEngineService } from '../../services/rule-engine.service';
import { RuleGroupModel, RuleItemBody } from '../../model/rule-group.model';
import { LoadingService } from '../../core/loading-dialog/loading-dialog.component';
import { Message } from 'primeng/components/common/api';
import { MatDialog } from '../../../../node_modules/@angular/material';
import { DeleteDialogComponent } from '../../delete-dialog/delete-dialog.component';
import { CommonServicesService } from '../../services/common-services.service';
import { BasicInformationService } from '../../services/basic-information.service';
import { RuleTypeModel } from '../../model/rule-type.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-show-rule-groups',
  templateUrl: './show-rule-groups.component.html',
  styleUrls: ['./show-rule-groups.component.css']
})
export class ShowRuleGroupsComponent implements OnInit, OnChanges {
  @Input() cartableType: number;
  @Output() modifyRuleItems = new EventEmitter<RuleGroupModel>();

  public ruleGroups: RuleGroupModel[] = [];
  public errorMessages: Message[] = [];
  public hasResult: boolean = null;
  public ruleTypes: RuleTypeModel[] = [];
  constructor(
    private ruleEngineService: RuleEngineService,
    private loading: LoadingService,
    private dialog: MatDialog,
    private router: Router) { }

  ngOnChanges() {
    this.getRuleGroups();
    this.getRuleTypes();
  }

  ngOnInit() { }

  getRuleGroups() {
    this.hasResult = null;
    this.loading.start();
    this.ruleGroups = [];
    this.ruleEngineService.getRuleGroups(this.cartableType).subscribe(
      (res) => {
        if (res.length > 0) {
          this.hasResult = true;
        } else {
          this.hasResult = false;
        }
        if (this.hasResult) {
          this.fillRuleGroupList(res);
        }
        this.loading.stop();
      }, (error) => {
        this.errorMessages.push({ severity: 'error', summary: 'پیغام خطا', detail: 'خطا در گرفتن لیست گروه ها', });
        this.loading.stop();
      }
    );
  }

  fillRuleGroupList(data: RuleGroupModel[]) {
    data.forEach(element => {
      element.RuleItems.forEach(ruleItem => {
        const body = JSON.parse(ruleItem.Body);
        ruleItem.BodyObj = new RuleItemBody();
        ruleItem.BodyObj.LeftOperand = body.LeftOperand;
        ruleItem.BodyObj.Operator = body.Operator;
        ruleItem.BodyObj.RightOperand = body.RightOperand;
        ruleItem.RuleType = this.ruleTypes.find(x => x.Name === ruleItem.BodyObj.LeftOperand);
      });
    });
    this.ruleGroups = data;
  }

  getRuleTypes() {
    this.ruleTypes = [];
    this.ruleEngineService.getRuleTypes().subscribe(
      (res: any) => {
        this.ruleTypes = res;
      },
      (error: any) => {

      }
    );
  }

  addRuleItem(ruleGroup: RuleGroupModel = new RuleGroupModel()) {
    ruleGroup.CartableType = this.cartableType;
    this.modifyRuleItems.emit(ruleGroup);
  }

  openTestPage() {
    this.router.navigate(['../../../rule-engine/test/' + this.cartableType]);
  }

  deleteRuleGroup(id: number) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      disableClose: true,
      data: 'آیا از حذف این گروه اطمینان دارید ؟',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading.start();
        this.ruleEngineService.deleteRuleGroup(id).subscribe(
          (res: any) => {
            this.getRuleGroups();
          }, (error: any) => {
            this.errorMessages.push({ severity: 'error', summary: 'پیغام خطا', detail: 'خطا در حذف کردن گروه', });
            this.loading.stop();
          }
        );
      }
    });


  }

  triggleActiveField(id: number) {
    this.loading.start();
    this.ruleEngineService.triggleActiveField(id).subscribe(
      (res: any) => {
        this.getRuleGroups();
      }, (error: any) => {
        this.errorMessages.push({ severity: 'error', summary: 'پیغام خطا', detail: 'خطا در فعال / غیر فعال کردن گروه', });
        this.loading.stop();
      }
    );
  }
}
