import { Component, OnInit, Inject, Version } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { VersionConfirmModel } from '../../model/version-confirm.model';
import { ServiceParameterModel } from '../../model/service-parameter.model';
import { Message } from 'primeng/api';
import { SettingModel } from '../../model/setting.model';
import { ServiceUrlModel } from '../../model/service-url.model';
import { BasicInformationService } from '../../services/basic-information.service';
import { SwaggerModel } from '../../model/swagger.model';

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
  public swaggerModel: SwaggerModel = new SwaggerModel();

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
    if (!this.urlValue.url ||
      !this.urlValue.controller ||
      !this.urlValue.action ||
      !this.urlValue.swaggerUrl ||
      !this.urlValue.http) {
      return true;
    }
    return false;
  }

  removeParameter(data: ServiceParameterModel) {
    const index = this.params.indexOf(data);
    this.params.splice(index, 1);
  }

  closeDialog(isSave: boolean = false) {
    if (isSave) {
      this.data.find(x => x.name === 'پارامتر').value = JSON.stringify(this.params);
      this.data.find(x => x.name === 'مشخصات سرویس').value = JSON.stringify(this.urlValue);
      this.dialogRef.close(this.data);
    }
    this.dialogRef.close();
  }

  getApiInfo() {
    this.swaggerModel = new SwaggerModel();
    this.basicInformationService.getServiceParameters(this.urlValue).subscribe(
      (res: any) => {
        this.swaggerModel.isUsed = true;
        this.swaggerModel.data = res;
        this.swaggerModel.getPrefixes();

      }
    );
  }

  prefixChange(event: any) {
    this.swaggerModel.getControllers(event.value);
  }

  controllerChange(event: any) {
    this.swaggerModel.getActions(event.value);
  }

  actionChange($event) {
    this.swaggerModel.getHttps(this.urlValue.getFullPath());
    this.https = this.swaggerModel.https;
  }

  getParameters() {
    const model = this.generateModelFromSwagger(this.swaggerModel.data);
    this.params = [];
    Object.keys(model.properties).forEach(element => {
      this.params.push({
        name: element,
        value: '',
      });
    });
  }

  generateModelFromSwagger(data: any): any {
    const api = data.paths[this.getControllerAddress(this.urlValue)];
    let modelAddress = api[this.urlValue.http].requestBody.content['application/*+json'].schema.$ref;
    modelAddress = modelAddress.replace('#/', '');
    const modelAddressArray = modelAddress.split('/');
    const model = data[modelAddressArray[0]][modelAddressArray[1]][modelAddressArray[2]];
    return model;
  }

  getControllerAddress(model: ServiceUrlModel) {
    let result = '';
    if (model.prefix) {
      result += '/' + model.prefix;
    }
    if (model.controller) {
      result += '/' + model.controller;
    }

    if (model.action) {
      result += '/' + model.action;
    }
    return result;
  }
}
