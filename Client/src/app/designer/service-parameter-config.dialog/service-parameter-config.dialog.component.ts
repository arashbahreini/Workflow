import { Component, OnInit, Inject, Version } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { VersionConfirmModel } from '../../model/version-confirm.model';
import { ServiceParameterModel } from '../../model/service-parameter.model';
import { Message } from 'primeng/api';
import { SettingModel } from '../../model/setting.model';
import { ServiceUrlModel } from '../../model/service-url.model';
import { BasicInformationService } from '../../services/basic-information.service';

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
    private basicInformationService: BasicInformationService,
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
    this.https.push('post', 'put', 'delete', 'get');
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
    if (!this.urlValue.url || !this.urlValue.controller || !this.urlValue.action) {
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

  getParameters() {
    this.basicInformationService.getServiceParameters(this.urlValue).subscribe(
      (res: any) => {
        const model = this.generateModelFromSwagger(res);
        this.params = [];
        Object.keys(model.properties).forEach(element => {
          this.params.push({
            name: element,
            value: '',
          });
        });
      }
    );
  }

  generateModelFromSwagger(data: any): any {
    const api = data.paths[this.urlValue.getControllerAddress()];
    let modelAddress = api[this.urlValue.http].requestBody.content['application/*+json'].schema.$ref;
    modelAddress = modelAddress.replace('#/', '');
    const modelAddressArray = modelAddress.split('/');
    const model = data[modelAddressArray[0]][modelAddressArray[1]][modelAddressArray[2]];
    return model;
  }
}
