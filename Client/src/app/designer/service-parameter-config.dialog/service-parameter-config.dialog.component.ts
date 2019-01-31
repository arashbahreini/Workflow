import { Component, OnInit, Inject, Version } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { VersionConfirmModel } from '../../model/version-confirm.model';
import { ServiceParameterModel } from '../../model/service-parameter.model';
import { Message } from 'primeng/api';

@Component({
  selector: 'app-service-parameter-config.dialog',
  templateUrl: './service-parameter-config.dialog.component.html',
  styleUrls: ['./service-parameter-config.dialog.component.css']
})
export class ServiceParameterConfigComponent implements OnInit {

  public errorMessages: Message[] = [];
  public result: VersionConfirmModel = new VersionConfirmModel();

  constructor(
    private dialogRef: MatDialogRef<ServiceParameterConfigComponent>,
    @Inject(MAT_DIALOG_DATA) public datas: ServiceParameterModel[] = [],
  ) {
    if (this.datas.length === 0) {
      this.datas.push(new ServiceParameterModel());
    }
  }

  ngOnInit() {
  }

  addNewParameter(data: ServiceParameterModel) {
    if (!data.name || !data.value) {
      this.errorMessages.push({ severity: 'error', summary: 'پیغام خطا', detail: 'یک یا چند فیلد خالیست', });
      return;
    }
    this.datas.forEach(element => {
      element.isNew = false;
    });
    this.datas.push(new ServiceParameterModel());
  }

  closeDialog() {
    if (this.datas.find(x => !x.name || !x.value)) {
      const index = this.datas.indexOf(this.datas.find(x => x.isNew === true));
      this.datas.splice(index, 1);
    }
    this.dialogRef.close(JSON.stringify(this.datas));
  }
}
