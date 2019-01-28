import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SettingModel } from '../../model/setting.model';
import { LoadingService } from '../../core/loading-dialog/loading-dialog.component';
import { RuleGroupModel } from '../../model/rule-group.model';
import { RuleEngineService } from '../../services/rule-engine.service';
import { Message } from 'primeng/components/common/api';

@Component({
  selector: 'app-show-rules.dialog',
  templateUrl: './show-rules.dialog.component.html',
  styleUrls: ['./show-rules.dialog.component.css']
})
export class ShowRulesDialogComponent implements OnInit {

  public hasResult: boolean;
  public ruleGroups: RuleGroupModel[] = [];
  public errorMessages: Message[] = [];
  public isLoading: boolean;
  constructor(
    private dialogRef: MatDialogRef<ShowRulesDialogComponent>,
    private ruleEngineService: RuleEngineService,
    @Inject(MAT_DIALOG_DATA) public setting: SettingModel = new SettingModel(),
  ) { }

  ngOnInit() {
    this.getRuleGroups();
  }

  closeDialog(data: any) {
    if (data === null) {
      this.dialogRef.close(data);
    } else {
      this.setting.rules = [];
      this.setting.value = [];
      this.ruleGroups.forEach(element => {
        if (element.select) {
          this.setting.rules.push(element.Id);
        }
      });
      this.setting.value = JSON.stringify(this.setting.rules);
      this.dialogRef.close(this.setting);
    }
  }

  getRuleGroups() {
    this.isLoading = true;
    this.hasResult = null;
    this.ruleGroups = [];
    this.ruleEngineService.getRuleGroups(this.setting.workflowId).subscribe(
      (res: RuleGroupModel[]) => {
        res.forEach(element => {
          if (element.IsActive) {
            if (this.setting.value) {
              const rules = JSON.parse(this.setting.value);
              if (rules.find(x => x === element.Id)) {
                element.select = true;
              }
            }
            this.ruleGroups.push(element);
          }
        });
        this.hasResult = res.length > 0;
        this.isLoading = false;
      }, (error) => {
        this.errorMessages.push({ severity: 'error', summary: 'پیغام خطا', detail: 'خطا در گرفتن لیست گروه ها', });
        this.isLoading = false;
      }
    );
  }
}
