import { Component, OnInit, Inject, Version } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { VersionConfirmModel } from '../../model/version-confirm.model';
import { ServiceParameterModel } from '../../model/service-parameter.model';
import { Message } from 'primeng/api';
import { SettingModel } from '../../model/setting.model';
import { ServiceUrlModel } from '../../model/service-url.model';

@Component({
  selector: 'app-service-parameter-config.dialog',
  templateUrl: './service-parameter-config.dialog.component.html',
  styleUrls: ['./service-parameter-config.dialog.component.css']
})
export class ServiceParameterConfigComponent implements OnInit {

  public errorMessages: Message[] = [];
  public result: VersionConfirmModel = new VersionConfirmModel();
  public params: ServiceParameterModel[] = [];
  public urlValue: ServiceUrlModel = new ServiceUrlModel();
  public https: string[] = [];
  constructor(
    private dialogRef: MatDialogRef<ServiceParameterConfigComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SettingModel[] = [],
  ) {
    if (this.data.find(x => x.name === 'پارامتر')) {
      this.params = JSON.parse(this.data.find(x => x.name === 'پارامتر').value);
    } else {
      this.params = [];
    }
    if (this.data.find(x => x.name === 'مشخصات سرویس')) {
      if (this.data.find(x => x.name === 'مشخصات سرویس').value) {
        this.urlValue = JSON.parse(this.data.find(x => x.name === 'مشخصات سرویس').value);
      }
    } else {
      this.urlValue = new ServiceUrlModel();
    }
  }

  ngOnInit() {
    this.getHttps();
  }

  getHttps() {
    this.https = [];
    this.https.push('Post', 'Put', 'Delete', 'Get');
  }

  addNewParameter(data: ServiceParameterModel) {
    let isValid = true;
    this.params.forEach(element => {
      if (!element.name || !element.value) {
        isValid = false;
      }
    });
    if (isValid) {
      this.params.push(new ServiceParameterModel());
    }
  }

  disableGetParams() {
    if (!this.urlValue.controller ||
      !this.urlValue.action ||
      !this.urlValue.url ||
      !this.urlValue.http) {
      return true;
    }
    return false;
  }

  removeParameter(data: ServiceParameterModel) {
    const index = this.params.indexOf(data);
    this.params.splice(index, 1);
  }

  closeDialog() {
    this.dialogRef.close(JSON.stringify(this.params));
  }
}
