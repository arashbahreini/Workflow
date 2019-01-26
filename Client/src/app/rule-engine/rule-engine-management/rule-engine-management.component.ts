import { Component, OnInit } from '@angular/core';
import { CommonServicesService } from '../../services/common-services.service';
import { RuleGroupModel } from '../../model/rule-group.model';
import { Message } from 'primeng/components/common/api';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-rule-engine-management',
  templateUrl: './rule-engine-management.component.html',
  styleUrls: ['./rule-engine-management.component.css']
})
export class RuleEngineManagementComponent implements OnInit {

  public isModifying: boolean = false;
  public cartableType: number;
  public ruleGroup: RuleGroupModel = new RuleGroupModel();
  public errorMessages: Message[] = [];
  constructor(
    private commonService: CommonServicesService,
    private route: ActivatedRoute,
    public router: Router,
  ) {

    this.route.url.subscribe(url => {
      this.isModifying = false;
      this.setCartableType();
    })
  }

  ngOnInit() {
    this.setCartableType();
  }

  setCartableType() {
    this.route.params.subscribe((params: Params) => {
      this.cartableType = +params['id'];
    });
  }

  onModifyRuleItem(event: RuleGroupModel) {
    this.ruleGroup = event;
    this.isModifying = true;
  }

  onSaveRuleGroup(event: string) {
    if (event === 'success') {
      this.errorMessages = [];
      this.isModifying = false;
      this.errorMessages.push({ severity: 'success', summary: 'پیغام خطا', detail: 'گروه قوانین با موفقیت ذخیره شد', })
    }
  }
}
