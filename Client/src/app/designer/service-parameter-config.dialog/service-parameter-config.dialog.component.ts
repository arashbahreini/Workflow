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
    let isValid = true;
    this.datas.forEach(element => {
      if (!element.name || !element.value) {
        isValid = false;
      }
    });
    if (isValid) {
      this.datas.push(new ServiceParameterModel());
    }
  }

  removeParameter(data: ServiceParameterModel) {
    const index = this.datas.indexOf(data);
    this.datas.splice(index, 1);
  }

  closeDialog() {
    this.dialogRef.close(JSON.stringify(this.datas));
  }
}
