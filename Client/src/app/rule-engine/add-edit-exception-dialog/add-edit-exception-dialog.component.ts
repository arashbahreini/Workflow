import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatPaginator } from '@angular/material';
import { RuleExceptionModel } from '../../model/rule-group.model';
import { Message } from 'primeng/api';

@Component({
  selector: 'app-add-edit-exception-dialog',
  templateUrl: './add-edit-exception-dialog.component.html',
  styleUrls: ['./add-edit-exception-dialog.component.css'],
})
export class AddEditExceptionComponent implements OnInit {
  @ViewChild('matPaginator') pendingMatPaginator: MatPaginator;
  public errorMessages: Message[] = [];

  constructor(
    private dialogRef: MatDialogRef<AddEditExceptionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { data: RuleExceptionModel, action: string },
  ) {
  }
  ngOnInit() {
  }

  save() {
    if (
      !this.data.data.AcceptorNumber &&
      !this.data.data.Iban &&
      !this.data.data.NationalCode &&
      !this.data.data.TerminalNumber
    ) {
      this.errorMessages.push({ severity: 'error', summary: 'پیغام خطا', detail: 'همه ی فیلد ها خالی می باشند.', });
      return;
    }
    if (this.data.data.AcceptorNumber) {
      if (this.data.data.AcceptorNumber.toString().length !== 15) {
        this.errorMessages.push({ severity: 'error', summary: 'پیغام خطا', detail: '.شماره ی پذیرنده باید 15 کاراکتر باشد', });
        return;
      }
    }

    if (this.data.data.NationalCode) {
      if (this.data.data.NationalCode.toString().length !== 10) {
        this.errorMessages.push({ severity: 'error', summary: 'پیغام خطا', detail: 'کد ملی باید 10 کاراکتر باشد.', });
        return;
      }
    }

    if (this.data.data.TerminalNumber) {
      if (this.data.data.TerminalNumber.toString().length !== 8) {
        this.errorMessages.push({ severity: 'error', summary: 'پیغام خطا', detail: 'کد پایانه باید 8 کاراکتر باشد.', });
        return;
      }
    }
    this.dialogRef.close(this.data.data);
  }
}
